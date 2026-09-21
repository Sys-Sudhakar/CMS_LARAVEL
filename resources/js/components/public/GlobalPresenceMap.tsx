import { useMemo, useState } from 'react';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
} from 'react-simple-maps';

interface GlobalPresenceLocation {
    id?: number | string;
    country: string;
    city?: string;
    company?: string;
    office_name?: string;
    type?: 'headquarters' | 'regional_office' | string;
    latitude?: number | string;
    longitude?: number | string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    map_url?: string;
}

interface GlobalPresenceMapProps {
    heading?: string;
    subtitle?: string;
    variant?: 'map' | 'offices' | 'map_offices' | string;
    locations?: GlobalPresenceLocation[];
    offices?: GlobalPresenceLocation[];
}

const geographyUrl =
    'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const normalizePhone = (phone: string) =>
    phone.replace(/[^\d+]/g, '');

export default function GlobalPresenceMap({
    heading = 'Global Presence',
    subtitle = 'Serving clients across strategic locations worldwide',
    variant = 'map_offices',
    locations,
    offices,
}: GlobalPresenceMapProps) {
    const sourceLocations =
        Array.isArray(offices)
            ? offices
            : Array.isArray(locations)
              ? locations
              : [];

    const [activeLocation, setActiveLocation] =
        useState<GlobalPresenceLocation | null>(null);

    const [hoveredLocation, setHoveredLocation] =
        useState<GlobalPresenceLocation | null>(null);

    const validLocations = useMemo(
        () =>
            sourceLocations.filter((location) => {
                const latitude = Number(location.latitude);
                const longitude = Number(location.longitude);

                return (
                    Number.isFinite(latitude) &&
                    Number.isFinite(longitude)
                );
            }),
        [sourceLocations],
    );

    const showMap =
        variant === 'map' ||
        variant === 'map_offices' ||
        !variant;

    const showCards =
        variant === 'offices' ||
        variant === 'map_offices';

    return (
        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="mb-9 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600">
                        Worldwide Network
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        {heading}
                    </h2>

                    <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-red-600" />

                    {subtitle && (
                        <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* =====================================================
                    MAP
                ====================================================== */}

                {showMap && (
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">

                        {validLocations.length === 0 ? (
                            <div className="flex min-h-[430px] items-center justify-center px-6 text-center">
                                <div>
                                    <p className="font-semibold text-slate-900">
                                        No map locations available
                                    </p>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Add valid latitude and longitude values to the office in the CMS.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative h-[440px] w-full sm:h-[500px] lg:h-[540px]">

                                <ComposableMap
                                    width={1000}
                                    height={520}
                                    projection="geoEqualEarth"
                                    projectionConfig={{
                                        scale: 192,
                                        center: [8, 6],
                                    }}
                                    className="h-full w-full"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    {/* COUNTRIES */}

                                    <Geographies geography={geographyUrl}>
                                        {({ geographies }) =>
                                            geographies.map((geo) => (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    fill="#244A9F"
                                                    stroke="#DCE5F5"
                                                    strokeWidth={0.5}
                                                    tabIndex={-1}
                                                    focusable="false"
                                                    className="pointer-events-none"
                                                    style={{
                                                        fill: '#244A9F',
                                                        outline: 'none',
                                                    }}
                                                />
                                            ))
                                        }
                                    </Geographies>


                                    {/* LOCATION MARKERS */}

                                    {validLocations.map(
                                        (location, index) => {
                                            const isHeadquarters =
                                                location.type ===
                                                'headquarters';

                                            const isActive =
                                                activeLocation ===
                                                    location ||
                                                hoveredLocation ===
                                                    location;

                                            return (
                                                <Marker
                                                    key={
                                                        location.id ??
                                                        `${location.country}-${location.city ?? index}`
                                                    }
                                                    coordinates={[
                                                        Number(
                                                            location.longitude,
                                                        ),
                                                        Number(
                                                            location.latitude,
                                                        ),
                                                    ]}
                                                >
                                                    <g
                                                        className="cursor-pointer"
                                                        onMouseEnter={() =>
                                                            setHoveredLocation(
                                                                location,
                                                            )
                                                        }
                                                        onMouseLeave={() =>
                                                            setHoveredLocation(
                                                                null,
                                                            )
                                                        }
                                                        onClick={() =>
                                                            setActiveLocation(
                                                                location,
                                                            )
                                                        }
                                                    >
                                                        {/* Soft outer halo */}
                                                        <circle
                                                            r={
                                                                isActive
                                                                    ? 15
                                                                    : isHeadquarters
                                                                      ? 12
                                                                      : 10
                                                            }
                                                            fill={
                                                                isHeadquarters
                                                                    ? 'rgba(225,29,72,0.16)'
                                                                    : 'rgba(153,27,27,0.10)'
                                                            }
                                                        />

                                                        {/* Clean white marker ring */}
                                                        <circle
                                                            r={
                                                                isActive
                                                                    ? 8
                                                                    : isHeadquarters
                                                                      ? 7
                                                                      : 6
                                                            }
                                                            fill="#ffffff"
                                                            stroke={
                                                                isHeadquarters
                                                                    ? '#E11D48'
                                                                    : '#991B1B'
                                                            }
                                                            strokeWidth={
                                                                isHeadquarters
                                                                    ? 2.6
                                                                    : 2
                                                            }
                                                        />

                                                        {/* Inner dot */}
                                                        <circle
                                                            r={
                                                                isHeadquarters
                                                                    ? 4
                                                                    : 3
                                                            }
                                                            fill={
                                                                isHeadquarters
                                                                    ? '#E11D48'
                                                                    : '#991B1B'
                                                            }
                                                        />
                                                    </g>
                                                </Marker>
                                            );
                                        },
                                    )}

                                </ComposableMap>

                                {/* HOVER TOOLTIP */}

                                {hoveredLocation && (
                                    <div className="pointer-events-none absolute left-1/2 top-5 z-30 w-[220px] -translate-x-1/2 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 text-center shadow-[0_12px_28px_rgba(15,23,42,0.16)] backdrop-blur">
                                        <p className="text-sm font-bold text-slate-900">
                                            {hoveredLocation.country ||
                                                hoveredLocation.city}
                                        </p>

                                        {hoveredLocation.city &&
                                            hoveredLocation.city !==
                                                hoveredLocation.country && (
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {hoveredLocation.city}
                                                </p>
                                            )}

                                        {(hoveredLocation.company ||
                                            hoveredLocation.office_name) && (
                                            <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">
                                                {hoveredLocation.company ||
                                                    hoveredLocation.office_name}
                                            </p>
                                        )}

                                        <div className="mt-2 flex items-center justify-center gap-1.5">
                                            <span
                                                className={`h-2 w-2 rounded-full ${
                                                    hoveredLocation.type ===
                                                    'headquarters'
                                                        ? 'bg-rose-600'
                                                        : 'bg-red-900'
                                                }`}
                                            />

                                            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                                                {hoveredLocation.type ===
                                                'headquarters'
                                                    ? 'Headquarters'
                                                    : 'Regional Office'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* COMPACT LEGEND INSIDE MAP */}

                                <div className="absolute bottom-4 left-4 z-30 flex items-center gap-4 rounded-lg border border-slate-200 bg-white/95 px-3.5 py-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.12)] backdrop-blur">
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-rose-500 bg-white">
                                            <span className="h-2 w-2 rounded-full bg-rose-600" />
                                        </span>

                                        <span className="text-xs font-semibold text-slate-800">
                                            Headquarters
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-red-900" />

                                        <span className="text-xs font-semibold text-slate-800">
                                            Regional Office
                                        </span>
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>
                )}

                {/* =====================================================
                    OFFICE CARDS
                ====================================================== */}

                {showCards && sourceLocations.length > 0 && (
                    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {sourceLocations.map(
                            (location, index) => (
                                <button
                                    key={
                                        location.id ??
                                        index
                                    }
                                    type="button"
                                    onClick={() =>
                                        setActiveLocation(
                                            location,
                                        )
                                    }
                                    className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            >
                                                <path d="M12 21s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z" />
                                                <circle
                                                    cx="12"
                                                    cy="9"
                                                    r="2.5"
                                                />
                                            </svg>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900">
                                                {location.country ||
                                                    location.city ||
                                                    `Office ${index + 1}`}
                                            </p>

                                            {location.city &&
                                                location.city !==
                                                    location.country && (
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {location.city}
                                                    </p>
                                                )}

                                            <p className="mt-1 text-xs font-medium text-red-600">
                                                {location.type ===
                                                'headquarters'
                                                    ? 'Headquarters'
                                                    : 'Regional Office'}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ),
                        )}
                    </div>
                )}

                {/* =====================================================
                    OFFICE DETAILS MODAL
                ====================================================== */}

                {activeLocation && (
                    <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm"
                        onClick={() =>
                            setActiveLocation(null)
                        }
                    >
                        <div
                            className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveLocation(null)
                                }
                                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-700 transition hover:bg-slate-200"
                                aria-label="Close location details"
                            >
                                ×
                            </button>

                            <div className="border-b border-slate-200 px-6 py-5 pr-16">
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-600">
                                    {activeLocation.type ===
                                    'headquarters'
                                        ? 'Headquarters'
                                        : 'Regional Office'}
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                    {activeLocation.country ||
                                        activeLocation.city}
                                </h3>

                                {(activeLocation.company ||
                                    activeLocation.office_name) && (
                                    <p className="mt-2 text-sm font-semibold text-slate-700">
                                        {activeLocation.company ||
                                            activeLocation.office_name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-5 px-6 py-5">
                                {activeLocation.address && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Address
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-slate-700">
                                            {activeLocation.address}
                                        </p>
                                    </div>
                                )}

                                {activeLocation.phone && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Phone
                                        </p>

                                        <a
                                            href={`tel:${normalizePhone(
                                                activeLocation.phone,
                                            )}`}
                                            className="mt-1 block text-sm font-medium text-slate-800 hover:text-red-600"
                                        >
                                            {
                                                activeLocation.phone
                                            }
                                        </a>
                                    </div>
                                )}

                                {activeLocation.email && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            Email
                                        </p>

                                        <a
                                            href={`mailto:${activeLocation.email}`}
                                            className="mt-1 block break-all text-sm font-medium text-slate-800 hover:text-red-600"
                                        >
                                            {
                                                activeLocation.email
                                            }
                                        </a>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3 pt-1">
                                    {activeLocation.map_url && (
                                        <a
                                            href={
                                                activeLocation.map_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                                        >
                                            View on Google Maps
                                        </a>
                                    )}

                                    {activeLocation.website && (
                                        <a
                                            href={
                                                activeLocation.website
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Visit Website
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
