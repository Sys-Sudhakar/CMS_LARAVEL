import {
    useCallback,
    useEffect,
    useSyncExternalStore,
} from 'react';

export type ResolvedAppearance = 'light' | 'dark';

export type Appearance =
    | ResolvedAppearance
    | 'system';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (
        mode: Appearance
    ) => void;
};

/*
|--------------------------------------------------------------------------
| Shared appearance state
|--------------------------------------------------------------------------
|
| This state is intentionally kept outside React so multiple components
| can subscribe to the same appearance value.
|
| IMPORTANT:
| Do not access window, document, localStorage, or matchMedia here.
| This module is also evaluated during SSR.
|
*/

let currentAppearance: Appearance = 'system';

const listeners = new Set<() => void>();


/*
|--------------------------------------------------------------------------
| Server snapshot
|--------------------------------------------------------------------------
|
| This must remain deterministic during SSR.
|
*/

const getServerSnapshot = (): Appearance => {
    return 'system';
};


/*
|--------------------------------------------------------------------------
| Browser helpers
|--------------------------------------------------------------------------
*/

const isBrowser = (): boolean => {
    return typeof window !== 'undefined';
};


/*
|--------------------------------------------------------------------------
| System appearance
|--------------------------------------------------------------------------
*/

const getSystemAppearance = (): ResolvedAppearance => {
    if (!isBrowser()) {
        return 'light';
    }

    return window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches
        ? 'dark'
        : 'light';
};


/*
|--------------------------------------------------------------------------
| Resolve appearance
|--------------------------------------------------------------------------
*/

const resolveAppearance = (
    appearance: Appearance
): ResolvedAppearance => {
    if (appearance === 'dark') {
        return 'dark';
    }

    if (appearance === 'light') {
        return 'light';
    }

    return getSystemAppearance();
};


/*
|--------------------------------------------------------------------------
| Local storage
|--------------------------------------------------------------------------
*/

const getStoredAppearance = (): Appearance => {
    if (!isBrowser()) {
        return 'system';
    }

    try {
        const stored =
            window.localStorage.getItem(
                'appearance'
            );

        if (
            stored === 'light' ||
            stored === 'dark' ||
            stored === 'system'
        ) {
            return stored;
        }
    } catch {
        /*
         * localStorage may be unavailable in some
         * browser privacy modes.
         */
    }

    return 'system';
};


/*
|--------------------------------------------------------------------------
| Cookie
|--------------------------------------------------------------------------
*/

const setAppearanceCookie = (
    appearance: Appearance
): void => {
    if (
        typeof document === 'undefined'
    ) {
        return;
    }

    try {
        const maxAge =
            365 * 24 * 60 * 60;

        document.cookie =
            `appearance=${appearance};` +
            `path=/;` +
            `max-age=${maxAge};` +
            `SameSite=Lax`;
    } catch {
        /*
         * Ignore cookie failures.
         */
    }
};


/*
|--------------------------------------------------------------------------
| Apply appearance to document
|--------------------------------------------------------------------------
*/

const applyAppearanceToDocument = (
    appearance: Appearance
): void => {
    if (
        typeof document === 'undefined'
    ) {
        return;
    }

    const resolved =
        resolveAppearance(appearance);

    document.documentElement.classList.toggle(
        'dark',
        resolved === 'dark'
    );

    document.documentElement.style.colorScheme =
        resolved;
};


/*
|--------------------------------------------------------------------------
| External store subscription
|--------------------------------------------------------------------------
*/

const subscribe = (
    callback: () => void
): (() => void) => {
    listeners.add(callback);

    return () => {
        listeners.delete(callback);
    };
};


/*
|--------------------------------------------------------------------------
| Notify subscribers
|--------------------------------------------------------------------------
*/

const notify = (): void => {
    listeners.forEach(
        (listener) => listener()
    );
};


/*
|--------------------------------------------------------------------------
| Current appearance
|--------------------------------------------------------------------------
*/

const getAppearance = (): Appearance => {
    return currentAppearance;
};


/*
|--------------------------------------------------------------------------
| System theme listener
|--------------------------------------------------------------------------
*/

let mediaQueryList: MediaQueryList | null = null;

const handleSystemThemeChange = (): void => {
    /*
     * Only notify when the current mode is actually
     * using the system appearance.
     */
    if (
        currentAppearance === 'system'
    ) {
        applyAppearanceToDocument(
            currentAppearance
        );

        notify();
    }
};


/*
|--------------------------------------------------------------------------
| Initialize theme
|--------------------------------------------------------------------------
|
| Call this from the client only.
|
*/

export function initializeTheme(): void {
    if (!isBrowser()) {
        return;
    }

    const stored =
        getStoredAppearance();

    currentAppearance = stored;

    /*
     * Store a default value if nothing exists yet.
     */
    try {
        if (
            !window.localStorage.getItem(
                'appearance'
            )
        ) {
            window.localStorage.setItem(
                'appearance',
                'system'
            );
        }
    } catch {
        /*
         * Ignore localStorage errors.
         */
    }

    setAppearanceCookie(
        currentAppearance
    );

    applyAppearanceToDocument(
        currentAppearance
    );

    /*
     * Remove an existing listener before
     * creating a new one.
     */
    if (mediaQueryList) {
        mediaQueryList.removeEventListener(
            'change',
            handleSystemThemeChange
        );
    }

    mediaQueryList =
        window.matchMedia(
            '(prefers-color-scheme: dark)'
        );

    mediaQueryList.addEventListener(
        'change',
        handleSystemThemeChange
    );
}


/*
|--------------------------------------------------------------------------
| Appearance hook
|--------------------------------------------------------------------------
*/

export function useAppearance(): UseAppearanceReturn {
    const appearance =
        useSyncExternalStore(
            subscribe,
            getAppearance,
            getServerSnapshot
        );

    /*
     * Resolve the appearance after hydration.
     *
     * During SSR the server snapshot is always
     * "system", keeping SSR deterministic.
     */
    const [resolvedAppearance, setResolvedAppearance] =
        useSyncExternalStore(
            subscribe,
            () =>
                resolveAppearance(
                    currentAppearance
                ),
            () => 'light'
        );

    /*
     * Ensure the browser document reflects
     * the current appearance after hydration.
     */
    useEffect(() => {
        if (!isBrowser()) {
            return;
        }

        applyAppearanceToDocument(
            appearance
        );
    }, [appearance]);


    /*
     * Update appearance.
     */

    const updateAppearance = useCallback(
        (mode: Appearance): void => {
            currentAppearance = mode;

            if (isBrowser()) {
                try {
                    window.localStorage.setItem(
                        'appearance',
                        mode
                    );
                } catch {
                    /*
                     * Ignore localStorage errors.
                     */
                }

                setAppearanceCookie(
                    mode
                );

                applyAppearanceToDocument(
                    mode
                );
            }

            notify();
        },
        []
    );


    return {
        appearance,
        resolvedAppearance,
        updateAppearance,
    };
}