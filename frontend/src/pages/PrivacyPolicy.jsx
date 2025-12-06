import React from 'react'
import { Footer, Header } from '../components'

function PrivacyPolicy() {
    return (
        <div className="h-screen overflow-y-auto bg-[#121212] text-white">
            <section className="relative mx-auto max-w-3xl px-4 py-20">
                <div className="mb-16 text-center">
                    <h1 className="mb-3 text-sm text-[#08e6f5]">Privacy Policy</h1>
                    <h2 className="mb-4 text-4xl font-bold">We care about your privacy</h2>
                    <h3 className="text-gray-300">
                        Your privacy is important to us at YourTube. This policy explains how we collect, use, and protect your information when you use our platform.
                    </h3>
                </div>

                {/* Section 1 */}
                <div className="mb-8">
                    <p className="mb-4 text-gray-300">
                        YourTube collects certain information to provide and improve our services. This includes information
                        you provide directly as well as data collected automatically when you interact with our platform.
                    </p>
                    <p className="mb-4 text-gray-300">
                        We are committed to handling your information responsibly. We do not sell your personal data,
                        and we ensure that the information we store is protected using modern security practices.
                    </p>
                </div>

                {/* Section 2 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        What information do we collect?
                    </h3>
                    <p className="mb-4 text-gray-300">
                        We collect information that you provide directly when creating an account, uploading videos,
                        commenting, or contacting us. This may include your name, email address, profile details, and any
                        content you submit.
                    </p>

                    <p className="mb-4 text-gray-300">
                        Additionally, we automatically collect data such as your IP address, device type, browser details,
                        usage activity, pages viewed, watch history, and interactions to help improve your experience and
                        keep the platform secure.
                    </p>

                    <p className="mb-4 text-gray-300">
                        If you sign in through a third-party provider like Google, we may receive certain public profile
                        details as permitted by your privacy settings.
                    </p>
                </div>

                {/* Section 3 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        How do we use your information?
                    </h3>
                    <p className="mb-4 text-gray-300">
                        We use your information to operate, maintain, and improve the YourTube platform. This includes providing
                        account access, processing uploads, personalizing recommendations, and enabling interactions such as
                        likes, comments, and subscriptions.
                    </p>

                    <p className="mb-4 text-gray-300">
                        Your information also helps us detect fraud, prevent abuse, respond to customer support requests,
                        and send important account or service-related notifications.
                    </p>

                    <p className="mb-4 text-gray-300">
                        We do not sell your information. Any sharing that occurs is strictly for operational, security, or legal requirements.
                    </p>
                </div>

                {/* Section 4 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        Do we use cookies and other tracking technologies?
                    </h3>
                    <p className="mb-4 text-gray-300">
                        Yes. We use cookies and similar technologies to remember your preferences, keep you logged in,
                        understand your usage patterns, and improve video recommendations. You may disable cookies in your
                        browser, though some site features may not function correctly.
                    </p>
                </div>

                {/* Section 5 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        How long do we keep your information?
                    </h3>
                    <p className="mb-4 text-gray-300">
                        We retain your information for as long as your account remains active or as needed to provide our
                        services. You may delete your account at any time to remove your personal information from our systems,
                        except where legal obligations require us to retain certain data.
                    </p>
                </div>

                {/* Section 6 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        How do we keep your information safe?
                    </h3>
                    <p className="mb-4 text-gray-300">
                        We use administrative, technical, and physical security measures—such as encryption and access controls—
                        to safeguard your data. While we take strong measures, no system is completely secure. We encourage users to 
                        use strong passwords and protect their account credentials.
                    </p>
                </div>

                {/* Section 7 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        What are your privacy rights?
                    </h3>
                    <p className="mb-4 text-gray-300">
                        Depending on your location, you may have rights over your personal data including accessing,
                        correcting, deleting your information, or requesting a copy of your data. You may also request to
                        deactivate your account or limit how your data is processed.
                    </p>
                </div>

                {/* Section 8 */}
                <div className="mb-8">
                    <h3 className="mb-4 text-xl font-bold sm:text-2xl md:text-3xl">
                        How can you contact us about this policy?
                    </h3>
                    <p className="mb-4 text-gray-300">
                        If you have questions or concerns about this Privacy Policy or your data, you can reach us through:
                    </p>

                    <ol className="list-decimal pl-4 text-gray-300">
                        <li>Email: support@yourtube.com</li>
                        <li>Website: https://yourtube.com/contact</li>
                        <li>Customer Support Department, YourTube</li>
                    </ol>
                </div>

            </section>
        </div>
    )
}

export default PrivacyPolicy
