<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        Critical CMS Deletion Alert
    </title>
</head>

<body
    style="
        margin: 0;
        padding: 0;
        background: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
        color: #1f2937;
    "
>

<table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="
        background: #f4f6f8;
        padding: 32px 16px;
    "
>
    <tr>
        <td align="center">

            <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                    max-width: 680px;
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    overflow: hidden;
                "
            >

                {{-- =========================================================
                    HEADER
                ========================================================== --}}

                <tr>
                    <td
                        style="
                            background: #0A5F9E;
                            padding: 22px 28px;
                            color: #ffffff;
                        "
                    >

                        <div
                            style="
                                font-size: 20px;
                                font-weight: 700;
                            "
                        >
                            Sysnet Systems
                        </div>

                        <div
                            style="
                                margin-top: 4px;
                                font-size: 13px;
                                opacity: 0.9;
                            "
                        >
                            CMS Monitoring & Security Alert
                        </div>

                    </td>
                </tr>


                {{-- =========================================================
                    CONTENT
                ========================================================== --}}

                <tr>
                    <td
                        style="
                            padding: 28px;
                        "
                    >

                        <div
                            style="
                                display: inline-block;
                                border: 1px solid #fecaca;
                                border-radius: 999px;
                                background: #fee2e2;
                                padding: 6px 10px;
                                color: #b91c1c;
                                font-size: 12px;
                                font-weight: 700;
                                letter-spacing: 0.05em;
                            "
                        >
                            CRITICAL
                        </div>


                        <h1
                            style="
                                margin: 18px 0 8px;
                                color: #111827;
                                font-size: 22px;
                                line-height: 1.35;
                            "
                        >
                            Permanent deletion completed
                        </h1>


                        <p
                            style="
                                margin: 0;
                                color: #4b5563;
                                font-size: 14px;
                                line-height: 1.7;
                            "
                        >
                            Hello {{ $recipientName }},
                            a permanent deletion has been completed in the CMS.
                            This action cannot be restored from the Recycle Bin.
                        </p>


                        {{-- =================================================
                            DETAILS TABLE
                        ================================================== --}}

                        @php
                            $rows = [
                                'Action' => 'Permanent Delete',
                                'Record Type' => $entityType,
                                'Record Name' => $entityName,
                                'Original Record ID' => $entityId,
                                'Deletion Batch' => '#'.$batchId,
                                'Affected Records' => $affectedRecords,
                                'Performed By' => $performedBy,
                                'Performed At' => $performedAt,
                                'Status' => 'Purged',
                            ];
                        @endphp


                        <table
                            role="presentation"
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            border="0"
                            style="
                                margin-top: 24px;
                                border-collapse: collapse;
                            "
                        >

                            @foreach ($rows as $label => $value)

                                <tr>

                                    <td
                                        style="
                                            width: 190px;
                                            border-bottom: 1px solid #e5e7eb;
                                            padding: 11px 12px;
                                            color: #6b7280;
                                            font-size: 13px;
                                            vertical-align: top;
                                        "
                                    >
                                        {{ $label }}
                                    </td>

                                    <td
                                        style="
                                            border-bottom: 1px solid #e5e7eb;
                                            padding: 11px 12px;
                                            color: #111827;
                                            font-size: 13px;
                                            font-weight: 600;
                                            vertical-align: top;
                                        "
                                    >
                                        {{ $value }}
                                    </td>

                                </tr>

                            @endforeach


                            @if ($reason)

                                <tr>

                                    <td
                                        style="
                                            width: 190px;
                                            border-bottom: 1px solid #e5e7eb;
                                            padding: 11px 12px;
                                            color: #6b7280;
                                            font-size: 13px;
                                            vertical-align: top;
                                        "
                                    >
                                        Reason
                                    </td>

                                    <td
                                        style="
                                            border-bottom: 1px solid #e5e7eb;
                                            padding: 11px 12px;
                                            color: #111827;
                                            font-size: 13px;
                                            font-weight: 600;
                                            vertical-align: top;
                                        "
                                    >
                                        {{ $reason }}
                                    </td>

                                </tr>

                            @endif

                        </table>


                        {{-- =================================================
                            CTA
                        ================================================== --}}

                        <div
                            style="
                                margin-top: 26px;
                            "
                        >

                            <a
                                href="{{ $notificationsUrl }}"
                                style="
                                    display: inline-block;
                                    border-radius: 8px;
                                    background: #0A5F9E;
                                    padding: 11px 18px;
                                    color: #ffffff;
                                    font-size: 14px;
                                    font-weight: 700;
                                    text-decoration: none;
                                "
                            >
                                View CMS Notifications
                            </a>

                        </div>


                        {{-- =================================================
                            FOOTER INFORMATION
                        ================================================== --}}

                        <p
                            style="
                                margin: 24px 0 0;
                                color: #6b7280;
                                font-size: 12px;
                                line-height: 1.6;
                            "
                        >
                            Batch UUID:
                            {{ $batchUuid }}
                        </p>


                        <p
                            style="
                                margin: 8px 0 0;
                                color: #6b7280;
                                font-size: 12px;
                                line-height: 1.6;
                            "
                        >
                            This is an automated administrative alert generated
                            by the Sysnet CMS monitoring system.
                        </p>

                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>

</html>
