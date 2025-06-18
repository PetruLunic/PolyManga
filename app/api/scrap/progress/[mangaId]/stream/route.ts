import { NextRequest } from 'next/server';

const SCRAPING_SERVICE_URL = process.env.SCRAP_SERVER_URL || 'http://localhost:4000';
const SCRAPING_API_KEY = process.env.SCRAP_API_SECRET_KEY || '';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mangaId: string }> }
) {
  const { mangaId } = await params;

  try {
    // Make authenticated request to scraping service
    const response = await fetch(`${SCRAPING_SERVICE_URL}/scrap/progress/${mangaId}/stream`, {
      headers: {
        'x-api-key': SCRAPING_API_KEY,
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      console.error(`Scraping service responded with ${response.status}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Verify content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/event-stream')) {
      console.error(`Expected text/event-stream, got ${contentType}`);
      throw new Error('Invalid content type from scraping service');
    }

    // Create a readable stream that proxies the SSE connection
    const stream = new ReadableStream({
      start(controller) {
        if (!response.body) {
          controller.close();
          return;
        }

        const reader = response.body.getReader();

        function pump(): Promise<void> {
          return reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            return pump();
          }).catch(error => {
            console.error('Stream reading error:', error);
            controller.error(error);
          });
        }

        return pump();
      },
      cancel() {
        // Cleanup when client disconnects
        response.body?.cancel();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'X-Accel-Buffering': 'no',
      },
    });

  } catch (error) {
    console.error('SSE proxy error:', error);

    // Return an error event stream instead of HTML
    const errorStream = new ReadableStream({
      start(controller) {
        const errorMessage = JSON.stringify({
          status: 'error',
          message: error instanceof Error ? error.message : 'Connection failed',
          currentChapter: null,
          totalChapters: 0,
          completedChapters: 0,
          startTime: new Date(),
          errors: [error instanceof Error ? error.message : 'Unknown error']
        });

        controller.enqueue(new TextEncoder().encode(`data: ${errorMessage}\n\n`));
        controller.close();
      }
    });

    return new Response(errorStream, {
      status: 200, // Return 200 to avoid EventSource retries
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
  }
}
