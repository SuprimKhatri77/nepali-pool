import * as React from 'react';
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Button,
    Hr,
    Tailwind,
} from '@react-email/components';


export default function EmailVerification({ name, url }: { name: string, url: string }) {
    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="bg-white mx-auto px-[40px] py-[40px] rounded-[8px] max-w-[600px]">
                        {/* Header */}
                        <Section className="text-center mb-[32px]">
                            <Text className="text-[24px] font-bold text-gray-900 m-0">
                                Verify Your Email Address
                            </Text>
                        </Section>

                        {/* Main Content */}
                        <Section className="mb-[32px]">
                            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                                Hello {name},
                            </Text>

                            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                                Thank you for signing up! To complete your registration and secure your account,
                                please verify your email address by clicking the button below.
                            </Text>

                            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[32px]">
                                This verification link will expire in 24 hours for security purposes.
                            </Text>

                            {/* Verification Button */}
                            <Section className="text-center mb-[32px]">
                                <Button
                                    href={url}
                                    className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[6px] text-[16px] font-medium no-underline box-border"
                                >
                                    Verify Email Address
                                </Button>
                            </Section>

                            <Text className="text-[14px] text-gray-600 leading-[20px] mb-[16px]">
                                If the button above doesn't work, you can also copy and paste this link into your browser:
                            </Text>

                            <Text className="text-[14px] text-blue-600 leading-[20px] mb-[24px] break-all">
                                {url}
                            </Text>

                            <Text className="text-[14px] text-gray-600 leading-[20px]">
                                If you didn't create an account with us, please ignore this email or contact our support team.
                            </Text>
                        </Section>

                        <Hr className="border-gray-200 my-[32px]" />

                        {/* Footer */}
                        <Section className="text-center">
                            <Text className="text-[12px] text-gray-500 leading-[16px] mb-[8px] m-0">
                                This email was sent by Nepali Pool
                            </Text>
                            <Text className="text-[12px] text-gray-500 leading-[16px] mb-[8px] m-0">
                                Butwal,10 - Devinagar
                            </Text>
                            <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                                © {new Date().getFullYear()} Nepali Pool. All rights reserved.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};


