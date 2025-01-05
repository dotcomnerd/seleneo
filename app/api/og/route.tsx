import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
    try {
        return new ImageResponse(
            (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}
                >
                    {/* Background Image */}
                    <img
                        src={"https://freedesign.fyi/studio-demo.png"}
                        alt="Background"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />

                    {/* Dark Overlay */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        }}
                    />

                    {/* Content Container */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '20px',
                            position: 'relative',
                            padding: '40px',
                        }}
                    >

                        <img
                            src={"https://freedesign.fyi/icon.svg"}
                            alt="Logo"
                            width={64}
                            height={64}
                            style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '12px',
                                objectFit: 'cover',
                            }}
                            
                        />

                        {/* Text */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '68px',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                }}
                            >
                                Seleneo
                            </span>
                            <span
                                style={{
                                    fontSize: '32px',
                                    color: '#ffffff',
                                    opacity: 0.8,
                                }}
                            >
                                freedesign.fyi
                            </span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )
    } catch (error) {
        console.error(error)
        return new Response('Failed to generate image', { status: 500 })
    }
}