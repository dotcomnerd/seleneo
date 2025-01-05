import { ImageResponse } from 'next/og';

export const runtime = 'edge'

export async function GET(request: Request) {
    const url = new URL(request.url);
    const path = url.searchParams.get('title') || '';
    // I wonder which witty person will exploit this ;)
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
                    <img
                        src={"https://freedesign.fyi/studio-demo.webp"}
                        alt="Background"
                        width={1200}
                        height={630}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        }}
                    />
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
                            src={"https://freedesign.fyi/logo.webp"}
                            alt="Logo"
                            width={84}
                            height={84}
                            style={{
                                width: '84px',
                                height: '84px',
                                borderRadius: '12px',
                                objectFit: 'cover',
                            }}

                        />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '98px',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    textDecoration: 'underline',
                                }}
                            >
                                {path === '' ? 'Seleneo' : path}
                            </span>
                            <span
                                style={{
                                    fontSize: '42px',
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