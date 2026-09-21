export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-gray-950 text-white">

            <div className="mx-auto max-w-7xl px-6 py-14">

                <div className="grid gap-10 md:grid-cols-4">

                    {/* Company */}
                    <div>
                        <h3 className="text-lg font-semibold">
                            SYSNET
                        </h3>

                        <p className="mt-4 text-sm leading-6 text-gray-400">
                            Empowering businesses through reliable
                            technology solutions, IT services and
                            innovative digital capabilities.
                        </p>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold">
                            Company
                        </h4>

                        <div className="mt-4 space-y-3 text-sm text-gray-400">
                            <p>About Us</p>
                            <p>Our Services</p>
                            <p>Global Presence</p>
                            <p>Contact Us</p>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold">
                            Services
                        </h4>

                        <div className="mt-4 space-y-3 text-sm text-gray-400">
                            <p>IT Infrastructure</p>
                            <p>Cloud Solutions</p>
                            <p>Cyber Security</p>
                            <p>Software Solutions</p>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold">
                            Contact
                        </h4>

                        <div className="mt-4 space-y-3 text-sm text-gray-400">
                            <p>Malaysia</p>
                            <p>sales@sysnet.com.my</p>
                            <p>+60</p>
                        </div>
                    </div>

                </div>

                <div className="mt-12 border-t border-gray-800 pt-6 text-sm text-gray-500">
                    © {new Date().getFullYear()} Sysnet. All rights reserved.
                </div>

            </div>

        </footer>
    );
}