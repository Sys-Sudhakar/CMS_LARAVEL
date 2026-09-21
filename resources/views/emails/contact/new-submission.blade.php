<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>New Contact Request</title>
</head>

<body
    style="
        margin: 0;
        padding: 0;
        background-color: #f4f7fa;
        font-family: Arial, Helvetica, sans-serif;
        color: #334e63;
    "
>

<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
        width: 100%;
        background-color: #f4f7fa;
        padding: 30px 15px;
    "
>
    <tr>
        <td align="center">

            <table
                width="650"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                    width: 100%;
                    max-width: 650px;
                    background-color: #ffffff;
                    border: 1px solid #d9e5ed;
                    border-radius: 10px;
                    overflow: hidden;
                "
            >

                <tr>
                    <td
                        style="
                            background-color: #0b5e9c;
                            padding: 24px 30px;
                        "
                    >
                        <h2
                            style="
                                margin: 0;
                                color: #ffffff;
                                font-size: 22px;
                                font-weight: 700;
                            "
                        >
                            New Contact Request Received
                        </h2>
                    </td>
                </tr>

                <tr>
                    <td style="padding: 30px;">

                        <p
                            style="
                                margin: 0 0 20px;
                                font-size: 15px;
                                line-height: 1.7;
                            "
                        >
                            A new contact request has been submitted
                            through the website.
                        </p>

                        <table
                            width="100%"
                            cellpadding="12"
                            cellspacing="0"
                            border="0"
                            style="
                                width: 100%;
                                border-collapse: collapse;
                                font-size: 14px;
                            "
                        >

                            <tr>
                                <td
                                    width="180"
                                    style="
                                        border-bottom: 1px solid #e9f0f5;
                                        font-weight: 700;
                                        color: #12324a;
                                    "
                                >
                                    Name
                                </td>

                                <td
                                    style="
                                        border-bottom: 1px solid #e9f0f5;
                                    "
                                >
                                    {{ $submission->name }}
                                </td>
                            </tr>

                            <tr>
                                <td
                                    style="
                                        border-bottom: 1px solid #e9f0f5;
                                        font-weight: 700;
                                        color: #12324a;
                                    "
                                >
                                    Email
                                </td>

                                <td
                                    style="
                                        border-bottom: 1px solid #e9f0f5;
                                    "
                                >
                                    {{ $submission->email }}
                                </td>
                            </tr>

                            <tr>
                                <td
                                    style="
                                        border-bottom: 1px solid #e9f0f5;
                                        font-weight: 700;
                                        color: #12324a;
                                    "
                                >
                                    Company
                                </td>

                                <td
                                    style="
                                        border-bottom: 1px solid #e9f0f5;
                                    "
                                >
                                    {{ $submission->company ?? 'Not provided' }}
                                </td>
                            </tr>

                            <tr>
                                <td
                                    style="
                                        border-bottom: 1px solid #e9f0f5;
                                        font-weight: 700;
                                        color: #12324a;
                                    "
                                >
                                    Phone
                                </td>

                                <td
                                    style="
                                        border-bottom: 1px solid #e9f0f5;
                                    "
                                >
                                    {{ $submission->phone ?? 'Not provided' }}
                                </td>
                            </tr>

                            <tr>
                                <td
                                    style="
                                        border-bottom: 1px solid #e9f0f5;
                                        font-weight: 700;
                                        color: #12324a;
                                    "
                                >
                                    Service Requested
                                </td>

                                <td
                                    style="
                                        border-bottom: 1px solid #e9f0f5;
                                        color: #0b5e9c;
                                        font-weight: 700;
                                    "
                                >
                                    {{ $submission->service_category ?? 'Not specified' }}
                                </td>
                            </tr>

                        </table>

                        <div
                            style="
                                margin-top: 25px;
                                padding: 18px;
                                background-color: #f6fafd;
                                border-left: 4px solid #0b5e9c;
                                border-radius: 4px;
                            "
                        >

                            <p
                                style="
                                    margin: 0 0 10px;
                                    font-weight: 700;
                                    color: #12324a;
                                "
                            >
                                Message
                            </p>

                            <p
                                style="
                                    margin: 0;
                                    font-size: 14px;
                                    line-height: 1.8;
                                    white-space: pre-line;
                                "
                            >
                                {{ $submission->message }}
                            </p>

                        </div>

                        <p
                            style="
                                margin: 25px 0 0;
                                font-size: 13px;
                                line-height: 1.7;
                                color: #64748b;
                            "
                        >
                            Please log in to the CMS to review and manage
                            this contact submission.
                        </p>

                    </td>
                </tr>

                <tr>
                    <td
                        style="
                            padding: 18px 30px;
                            background-color: #f6fafd;
                            border-top: 1px solid #e9f0f5;
                            text-align: center;
                            font-size: 12px;
                            color: #64748b;
                        "
                    >
                        This email was generated automatically
                        from the Sysnet website contact form.
                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>