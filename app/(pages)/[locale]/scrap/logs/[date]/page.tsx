import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Button,
  Spinner,
} from "@heroui/react";
import {
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdError, MdRefresh } from "react-icons/md";
import { getLogContent } from "../actions";
import { Suspense } from "react";
import { LogViewerClient } from "../_components/LogViewerClient";
import {BackToLogsButton} from "@/app/(pages)/[locale]/scrap/logs/_components/ClientButtons";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function LoadingState({ date }: { date: string }) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Spinner size="lg" color="primary" />
            <p className="mt-4 text-lg text-default-600">Loading logs for {date}...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, date }: { error: string; date: string }) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="max-w-md mx-auto mt-20">
          <CardHeader className="text-center">
            <div className="w-full flex items-center justify-center gap-2">
              <MdError className="w-6 h-6 text-danger" />
              <h1 className="text-2xl font-bold text-danger">Error Loading Logs</h1>
            </div>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button
                onPress={() => window.location.reload()}
                color="primary"
                startContent={<MdRefresh className="w-4 h-4" />}
              >
                Retry
              </Button>
              <BackToLogsButton />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

async function LogViewerContent({ date, searchParams }: { date: string; searchParams: any }) {
  const filters = {
    search: typeof searchParams.search === 'string' ? searchParams.search : undefined,
    level: typeof searchParams.level === 'string' ? searchParams.level : undefined,
    lines: typeof searchParams.lines === 'string' ? searchParams.lines : undefined,
  };

  const result = await getLogContent(date, filters);

  if (!result.success || !result.data) {
    return <ErrorState error={result.error || 'Failed to load logs'} date={date} />;
  }

  return (
    <div className="min-h-screen p-2 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BackToLogsButton />
              </div>
              <h1 className="text-3xl font-bold text-default-900">
                Logs for {date}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <Chip variant="flat" color="primary">
                  {result.data.file}
                </Chip>
                {result.data.compressed && (
                  <Chip variant="flat" color="warning" startContent={<FaExclamationTriangle className="w-3 h-3" />}>
                    Compressed
                  </Chip>
                )}
                <span className="text-sm text-default-600">
                  {result.data.filteredLines} of {result.data.totalLines} lines
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Client-side interactive components */}
        <LogViewerClient initialData={result.data} date={date} />
      </div>
    </div>
  );
}

export default async function LogViewerPage({ params, searchParams }: PageProps) {
  const {date} = await params;

  return (
    <Suspense fallback={<LoadingState date={date} />}>
      <LogViewerContent date={date} searchParams={await searchParams} />
    </Suspense>
  );
}
