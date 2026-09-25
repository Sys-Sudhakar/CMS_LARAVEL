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
        <section className="relative overflow-hidden bg-[#F7FAFD] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-32 top-20 h-[320px] w-[320px] rounded-full bg-[#0A5F9E]/7 blur-[120px]" />
                <div className="absolute -right-24 bottom-10 h-[300px] w-[300px] rounded-full bg-[#D71920]/5 blur-[120px]" />
            </div>
            <div className="relative z-10 mx-auto max-w-[1400px]">

                {/* =====================================================
                    HEADER
                ====================================================== */}

                <div className="mb-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                    <div>
                        <div className="inline-flex items-center gap-3">
                            <span className="h-[2px] w-7 bg-[#D71920]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0A5F9E] sm:text-xs">
                                Worldwide Network
                            </span>
                        </div>

                        <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-[#0B2D4D] sm:text-4xl lg:text-[50px]">
                            {heading}
                        </h2>

                        <div className="mt-5 flex items-center gap-2">
                            <span className="h-[3px] w-12 rounded-full bg-[#D71920]" />
                            <span className="h-[3px] w-5 rounded-full bg-[#0A5F9E]" />
                        </div>
                    </div>

                    {subtitle && (
                        <p className="max-w-3xl text-base leading-8 text-[#5C6F82] sm:text-[17px] lg:justify-self-end lg:text-right">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* =====================================================
                    MAP
                ====================================================== */}

                {showMap && (
                    <div className="relative overflow-hidden rounded-[36px] border border-[#D3E1EA] bg-white p-2.5 shadow-[0_28px_80px_rgba(11,45,77,0.14)]">

                        <div className="flex flex-col gap-3 border-b border-[#E8EFF4] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0A5F9E]">
                                    Interactive Office Network
                                </p>
                                <p className="mt-1 text-sm font-semibold text-[#42576B]">
                                    Select a marker to view office information.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-[#F2F7FA] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#607487]">
                                    {sourceLocations.length} Locations
                                </span>

                                <span className="rounded-full bg-[#EAF4FC] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0A5F9E]">
                                    Global Coverage
                                </span>
                            </div>
                        </div>

                        {validLocations.length === 0 ? (
                            <div className="flex min-h-[430px] items-center justify-center rounded-[28px] bg-white px-6 text-center">
                                <div>
                                    <p className="font-semibold text-[#0B2D4D]">
                                        No map locations available
                                    </p>

                                    <p className="mt-2 text-sm text-[#6E8192]">
                                        Add valid latitude and longitude values to the office in the CMS.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative h-[440px] w-full overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#EAF4FA_0%,#DCEBF4_100%)] sm:h-[500px] lg:h-[540px]">

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
                                                    fill="#BFD8E8"
                                                    stroke="#F7FAFD"
                                                    strokeWidth={0.5}
                                                    tabIndex={-1}
                                                    focusable="false"
                                                    className="pointer-events-none"
                                                    style={{
                                                        fill: '#BFD8E8',
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
                                                                    ? 'rgba(215,25,32,0.18)'
                                                                    : 'rgba(10,95,158,0.14)'
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
                                                                    ? '#D71920'
                                                                    : '#0A5F9E'
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
                                                                    ? '#D71920'
                                                                    : '#0A5F9E'
                                                            }
                                                        />
                                                    </g>
                                                </Marker>
                                            );
                                        },
                                    )}

                                </ComposableMap>

                                <div className="absolute right-4 top-4 z-20 hidden rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-[0_12px_30px_rgba(11,45,77,0.10)] backdrop-blur-md sm:block">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[#8A9AA8]">
                                        Live Office Map
                                    </p>
                                    <p className="mt-1 text-xs font-bold text-[#0B2D4D]">
                                        {validLocations.length} Active Locations
                                    </p>
                                </div>

                                {/* HOVER TOOLTIP */}

                                {hoveredLocation && (
                                    <div className="pointer-events-none absolute left-1/2 top-5 z-30 w-[230px] -translate-x-1/2 rounded-[18px] border border-[#D5E3EC] bg-white/95 px-4 py-3 text-center shadow-[0_18px_40px_rgba(11,45,77,0.18)] backdrop-blur-md">
                                        <p className="text-sm font-bold text-[#0B2D4D]">
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
                                                        ? 'bg-[#D71920]'
                                                        : 'bg-[#0A5F9E]'
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

                                <div className="absolute bottom-4 left-4 z-30 flex flex-wrap items-center gap-4 rounded-2xl border border-[#D5E3EC] bg-white/95 px-4 py-3 shadow-[0_14px_32px_rgba(11,45,77,0.12)] backdrop-blur-md">
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#D71920] bg-white">
                                            <span className="h-2 w-2 rounded-full bg-[#D71920]" />
                                        </span>

                                        <span className="text-xs font-semibold text-[#0B2D4D]">
                                            Headquarters
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#0A5F9E]" />

                                        <span className="text-xs font-semibold text-[#0B2D4D]">
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
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                                    className="group relative overflow-hidden rounded-[24px] border border-[#DCE7EF] bg-white p-5 text-left shadow-[0_10px_30px_rgba(11,45,77,0.055)] transition duration-300 hover:-translate-y-1.5 hover:border-[#A9CDE7] hover:shadow-[0_20px_48px_rgba(11,45,77,0.10)]"
                                >
                                    <div className="absolute left-0 top-0 h-[3px] w-14 bg-[linear-gradient(90deg,#0A5F9E,#D71920)] transition-all duration-300 group-hover:w-full" />

                                    <div className="absolute right-4 top-4 text-[10px] font-black text-[#C2CDD6]">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    <div className="flex items-start gap-3 pr-8">
                                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#EAF4FC,#F8FCFE)] text-[#0A5F9E] shadow-[inset_0_0_0_1px_rgba(10,95,158,0.08)]">
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
                                            <p className="text-sm font-bold text-[#0B2D4D]">
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

                                            <p className="mt-1 text-xs font-bold uppercase tracking-[0.10em] text-[#D71920]">
                                                {location.type ===
                                                'headquarters'
                                                    ? 'Headquarters'
                                                    : 'Regional Office'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between border-t border-[#EDF2F6] pt-4">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8A9AA8]">
                                            Office Details
                                        </span>

                                        <span className="text-[#0A5F9E] transition duration-300 group-hover:translate-x-1 group-hover:text-[#D71920]">
                                            →
                                        </span>
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
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#071D31]/80 px-4 backdrop-blur-md"
                        onClick={() =>
                            setActiveLocation(null)
                        }
                    >
                        <div
                            className="relative w-full max-w-2xl overflow-hidden rounded-[30px] border border-white/10 bg-white shadow-[0_34px_100px_rgba(7,29,49,0.38)]"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveLocation(null)
                                }
                                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCE7EF] bg-[#F5F9FC] text-lg text-[#42576B] transition hover:border-[#A9CDE7] hover:bg-[#EAF4FC] hover:text-[#0A5F9E]"
                                aria-label="Close location details"
                            >
                                ×
                            </button>

                            <div className="border-b border-[#E3EAF0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFD_100%)] px-6 py-6 pr-16">
                                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#D71920]">
                                    {activeLocation.type ===
                                    'headquarters'
                                        ? 'Headquarters'
                                        : 'Regional Office'}
                                </p>

                                <h3 className="mt-2 text-2xl font-extrabold text-[#0B2D4D]">
                                    {activeLocation.country ||
                                        activeLocation.city}
                                </h3>

                                {(activeLocation.company ||
                                    activeLocation.office_name) && (
                                    <p className="mt-2 text-sm font-semibold text-[#42576B]">
                                        {activeLocation.company ||
                                            activeLocation.office_name}
                                    </p>
                                )}

                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-[#EAF4FC] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0A5F9E]">
                                        {activeLocation.city || activeLocation.country}
                                    </span>

                                    <span className="rounded-full bg-[#FFF1F2] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#D71920]">
                                        {activeLocation.type === 'headquarters'
                                            ? 'Primary Office'
                                            : 'Regional Network'}
                                    </span>
                                </div>
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
                                            className="mt-1 block text-sm font-medium text-[#0B2D4D] hover:text-red-600"
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
                                            className="mt-1 block break-all text-sm font-medium text-[#0B2D4D] hover:text-red-600"
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
                                            className="rounded-xl bg-[#0A5F9E] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,95,158,0.16)] transition hover:-translate-y-0.5 hover:bg-[#084F84]"
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
                                            className="rounded-xl border border-[#C8D6E3] bg-white px-4 py-2.5 text-sm font-bold text-[#42576B] transition hover:-translate-y-0.5 hover:border-[#0A5F9E] hover:text-[#0A5F9E]"
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
