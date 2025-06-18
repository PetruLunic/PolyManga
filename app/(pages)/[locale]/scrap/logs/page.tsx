import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
} from "@heroui/react";
import {
  FaFileAlt,
  FaCalendarAlt,
  FaEye,
  FaChartBar,
  FaFilter
} from "react-icons/fa";
import { MdError } from "react-icons/md";
import { Suspense } from "react";
import { getLogFiles } from "./actions";
import {RefreshButton, ViewErrorsButton, ViewTodayLogsButton} from "./_components/ClientButtons";
import {LogsTable} from "@/app/(pages)/[locale]/scrap/logs/_components/LogsTable";

export const revalidate = 0;

function LoadingState() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Spinner size="lg" color="primary" />
            <p className="mt-4 text-lg text-default-600">Loading log files...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="max-w-md mx-auto mt-20">
          <CardHeader className="text-center">
            <div className="w-full flex items-center justify-center gap-2">
              <MdError className="w-6 h-6 text-danger" />
              <h1 className="text-2xl font-bold text-danger">Logs Unavailable</h1>
            </div>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600 mb-4">{error}</p>
            <RefreshButton />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

async function LogsContent() {
  const result = await getLogFiles();

  if (!result.success || !result.data) {
    return <ErrorState error={result.error || 'Failed to load log files'} />;
  }

  const { files, totalFiles } = result.data;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-default-900 flex items-center gap-3">
                <FaFileAlt className="w-8 h-8 text-primary" />
                Scraping Logs
              </h1>
              <p className="text-default-600 mt-1">
                Browse and analyze scraping service logs
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Chip variant="flat" color="primary" startContent={<FaCalendarAlt className="w-3 h-3" />}>
                {totalFiles} Log Files
              </Chip>
              <RefreshButton />
            </div>
          </div>
        </div>

        {/* Log Files Table */}
        <Card isBlurred>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaChartBar className="w-5 h-5 text-primary" />
              Available Log Files
            </h2>
          </CardHeader>
          <CardBody>
            {files.length === 0 ? (
              <div className="text-center py-8">
                <FaFileAlt className="w-12 h-12 text-default-300 mx-auto mb-4" />
                <p className="text-default-600">No log files found</p>
              </div>
            ) : (
              <LogsTable files={files}/>
            )}
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card isBlurred className="hover:shadow-md transition-shadow cursor-pointer">
            <CardBody className="text-center p-6">
              <FaEye className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Recent Logs</h3>
              <p className="text-sm text-default-600 mb-4">View today&apos;s latest logs</p>
              <ViewTodayLogsButton />
            </CardBody>
          </Card>

          <Card isBlurred className="hover:shadow-md transition-shadow cursor-pointer">
            <CardBody className="text-center p-6">
              <FaFilter className="w-8 h-8 text-warning mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Error Logs</h3>
              <p className="text-sm text-default-600 mb-4">Filter error entries</p>
              <ViewErrorsButton />
            </CardBody>
          </Card>

          {/*<Card className="hover:shadow-md transition-shadow cursor-pointer">*/}
          {/*  <CardBody className="text-center p-6">*/}
          {/*    <FaChartBar className="w-8 h-8 text-success mx-auto mb-3" />*/}
          {/*    <h3 className="font-semibold mb-2">Log Analytics</h3>*/}
          {/*    <p className="text-sm text-default-600 mb-4">View statistics</p>*/}
          {/*    /!*<Button*!/*/}
          {/*    /!*  color="success"*!/*/}
          {/*    /!*  size="sm"*!/*/}
          {/*    /!*  onPress={() => {*!/*/}
          {/*    /!*    alert('Analytics feature coming soon!');*!/*/}
          {/*    /!*  }}*!/*/}
          {/*    /!*>*!/*/}
          {/*    /!*  View Stats*!/*/}
          {/*    /!*</Button>*!/*/}
          {/*  </CardBody>*/}
          {/*</Card>*/}
        </div>
      </div>
    </div>
  );
}

export default function LogsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <LogsContent />
    </Suspense>
  );
}
