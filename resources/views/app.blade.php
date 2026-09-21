<!DOCTYPE html>

<html
    lang="{{ str_replace('_', '-', app()->getLocale()) }}"
    @class([
        'dark' => ($appearance ?? 'system') == 'dark',
    ])
>

<head>

    <meta charset="utf-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    >

    {{-- =========================================================
         SEO + SCHEMA TOOLS
         ========================================================= --}}

    {!! \Artesaos\SEOTools\Facades\SEOMeta::generate() !!}

    {!! \Artesaos\SEOTools\Facades\OpenGraph::generate() !!}

    {!! \Artesaos\SEOTools\Facades\JsonLdMulti::generate() !!}


    {{-- =========================================================
         APPEARANCE / DARK MODE
         ========================================================= --}}

    <script>
        (function () {

            const appearance =
                '{{ $appearance ?? "system" }}';

            if (appearance === 'system') {

                const prefersDark =
                    window.matchMedia(
                        '(prefers-color-scheme: dark)'
                    ).matches;

                if (prefersDark) {
                    document.documentElement
                        .classList
                        .add('dark');
                }
            }

        })();
    </script>


    {{-- =========================================================
         BASE HTML BACKGROUND
         ========================================================= --}}

    <style>

        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }

    </style>


    {{-- =========================================================
         FAVICON
         ========================================================= --}}

    <link
        rel="icon"
        type="image/png"
        href="/sysnet-icon.png"
    >

    <link
        rel="shortcut icon"
        type="image/png"
        href="/sysnet-icon.png"
    >

    <link
        rel="apple-touch-icon"
        href="/sysnet-icon.png"
    >


    {{-- =========================================================
         FONTS
         ========================================================= --}}

    @fonts


    {{-- =========================================================
         VITE
         ========================================================= --}}

    @viteReactRefresh

    @vite([
        'resources/css/app.css',
        'resources/js/app.tsx',
        "resources/js/pages/{$page['component']}.tsx",
    ])


    {{-- =========================================================
         INERTIA HEAD
         ========================================================= --}}

    <x-inertia::head />

</head>


<body class="font-sans antialiased">

    <x-inertia::app />

</body>

</html>