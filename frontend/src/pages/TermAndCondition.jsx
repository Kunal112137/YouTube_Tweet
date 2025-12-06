function TermAndCondition() {
    return (
        <div className="h-screen overflow-y-auto bg-[#121212] text-white">
            <section className="relative mx-auto max-w-3xl px-4 py-20">
                
                {/* HEADER */}
                <div className="mb-16 border-b pb-16 text-center">
                    <h1 className="mb-3 text-sm text-[#08e6f5]">
                        Current as of {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit'
                        })}
                    </h1>

                    <h2 className="mb-4 text-4xl font-bold">Terms and Conditions</h2>

                    <h3 className="text-gray-300">
                        By accessing or using YourTube, you agree to comply with these Terms and
                        Conditions. If you do not agree with any part of these terms, you may not
                        use the platform.
                    </h3>
                </div>

                {/* SECTION 1 */}
                <div className="mb-8">
                    <p className="mb-4 text-gray-300">
                        These Terms and Conditions govern your use of YourTube, including all
                        features, content, video uploads, interactions, and services offered through
                        the platform. By accessing our website or mobile application, you acknowledge
                        that you are responsible for complying with all applicable laws and
                        regulations.
                    </p>

                    <p className="mb-4 text-gray-300">
                        You agree not to misuse the platform, attempt unauthorized access, upload
                        harmful content, violate community guidelines, or engage in activities that
                        could disrupt platform functionality. We reserve the right to suspend or
                        terminate accounts that violate these terms.
                    </p>
                </div>

                {/* SECTION 2 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        What information do we collect?
                    </h3>

                    <p className="mb-4 text-gray-300">
                        YourTube collects information you provide directly, such as your name,
                        email, profile details, uploaded videos, comments, and messages. When you
                        use the platform, we automatically collect usage data including device
                        information, IP address, watch history, and interaction activity.
                    </p>

                    <p className="mb-4 text-gray-300">
                        If you choose to sign in using Google or another third-party provider, we
                        may receive certain account information such as your email and profile
                        picture as permitted by your privacy settings with those services.
                    </p>

                    <p className="mb-4 text-gray-300">
                        All collected information is handled according to our Privacy Policy.
                    </p>
                </div>

                {/* SECTION 3 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        How do we use your information?
                    </h3>

                    <p className="mb-4 text-gray-300">
                        We use the information we collect to operate, improve, and personalize your
                        experience on YourTube. This includes enabling uploads, managing your
                        account, providing video recommendations, monitoring platform performance,
                        and ensuring user safety.
                    </p>

                    <p className="mb-4 text-gray-300">
                        We may also use your information to communicate important updates, respond
                        to inquiries, improve customer support, and ensure compliance with legal
                        obligations.
                    </p>

                    <p className="mb-4 text-gray-300">
                        Your information is never sold and is only shared with trusted service
                        providers when necessary for platform operation.
                    </p>
                </div>

                {/* SECTION 4 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        Do we use cookies and other tracking technologies?
                    </h3>

                    <p className="mb-4 text-gray-300">
                        Yes. YourTube uses cookies, analytics tools, and similar tracking
                        technologies to improve site functionality, personalize content, track user
                        behavior, save preferences, and enhance overall experience. You may disable
                        cookies in your browser settings, though certain features may not work
                        properly.
                    </p>
                </div>

                {/* SECTION 5 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        How long do we keep your information?
                    </h3>

                    <p className="mb-4 text-gray-300">
                        We retain your information only for as long as is necessary to provide our
                        services or comply with legal requirements. You may delete your account at
                        any time, after which your personal information and uploaded content will be
                        removed except where retention is required for safety, legal, or fraud
                        prevention purposes.
                    </p>
                </div>

                {/* SECTION 6 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        How do we keep your information safe?
                    </h3>

                    <p className="mb-4 text-gray-300">
                        We use industry-standard security measures including encryption, secure data
                        storage, and access controls to protect your information. While we make
                        every effort to safeguard your data, no system can guarantee complete
                        security. We encourage users to keep their passwords secure and enable
                        account protection features.
                    </p>
                </div>

                {/* SECTION 7 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        What are your privacy rights?
                    </h3>

                    <p className="mb-4 text-gray-300">
                        Depending on your location, you may have rights to access, correct, delete,
                        or download your personal information. You may also request restrictions on
                        data processing or account deletion. To exercise your rights, please contact
                        our support team.
                    </p>
                </div>

                {/* SECTION 8 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        How can you contact us about this policy?
                    </h3>

                    <p className="mb-4 text-gray-300">
                        If you have any questions or concerns about these Terms and Conditions or
                        your data usage, you can reach out to our support team through the following
                        methods:
                    </p>

                    <ol className="list-decimal pl-4 text-gray-300">
                        <li>Email: support@yourtube.com</li>
                        <li>Contact Form: yourtube.com/contact</li>
                        <li>Customer Support Department, YourTube</li>
                    </ol>
                </div>

            </section>
        </div>
    )
}

export default TermAndCondition
