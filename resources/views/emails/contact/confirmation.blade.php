<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Thank You for Contacting Us</title>
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
                            Thank You for Contacting Us
                        </h2>

                    </td>
                </tr>

                <tr>
                    <td style="padding: 30px;">

                        <p
                            style="
                                margin: 0 0 18px;
                                font-size: 15px;
                                line-height: 1.7;
                            "
                        >
                            Dear {{ $submission->name }},
                        </p>

                        <p
                            style="
                                margin: 0 0 18px;
                                font-size: 15px;
                                line-height: 1.7;
                            "
                        >
                            Thank you for contacting
                            <strong>Sysnet Systems</strong>.
                            We have successfully received your enquiry.
                        </p>

                        <p
                            style="
                                margin: 0 0 12px;
                                font-size: 15px;
                                line-height: 1.7;
                            "
                        >
                            Your enquiry is related to the following service:
                        </p>

                        <div
                            style="
                                margin: 18px 0 24px;
                                padding: 18px;
                                background-color: #edf6fc;
                                border-left: 4px solid #0b5e9c;
                                border-radius: 4px;
                            "
                        >
                            <strong
                                style="
                                    color: #0b5e9c;
                                    font-size: 16px;
                                "
                            >
                                {{ $submission->service_category ?? 'Not specified' }}
                            </strong>
                        </div>

                        <p
                            style="
                                margin: 0 0 20px;
                                font-size: 15px;
                                line-height: 1.7;
                            "
                        >
                            Our team will review your request and
                            get back to you shortly.
                        </p>

                        <div
                            style="
                                margin-top: 20px;
                                padding: 18px;
                                background-color: #f6fafd;
                                border: 1px solid #d9e5ed;
                                border-radius: 6px;
                            "
                        >

                            <p
                                style="
                                    margin: 0 0 10px;
                                    font-weight: 700;
                                    color: #12324a;
                                "
                            >
                                Your Message
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
                                margin: 28px 0 0;
                                font-size: 15px;
                                line-height: 1.7;
                            "
                        >
                            Thank you for your interest in
                            Sysnet Systems.
                        </p>

                        <p
                            style="
                                margin: 20px 0 0;
                                font-size: 15px;
                                line-height: 1.7;
                            "
                        >
                            Regards,<br>
                            <strong>Sysnet Team</strong>
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
                        This is an automated confirmation email.
                        Please do not reply unless instructed.
                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>