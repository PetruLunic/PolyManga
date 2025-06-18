"use client"

import {
  Button,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Alert
} from "@heroui/react";
import scrapManga, { getGlobalScrapingStatus } from "./actions";
import { useQuery } from "@apollo/client/react";
import { GET_SCRAP_MANGA } from "@/app/lib/graphql/queries";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaBook,
  FaDownload,
  FaLock,
  FaUsers,
  FaServer
} from "react-icons/fa";
import { MdError, MdWarning } from "react-icons/md";
import {CgSpaceBetween} from "react-icons/cg";

export const dynamic = "force-dynamic";

interface Props {
  params: {
    id: string,
    locale: string
  }
}

interface ScrapingProgress {
  status: 'idle' | 'starting' | 'scraping' | 'completed' | 'error';
  currentChapter: number | null;
  totalChapters: number;
  completedChapters: number;
  message: string;
  startTime: Date;
  estimatedTimeRemaining?: number;
  errors: string[];
}

interface GlobalStatus {
  isLocked: boolean;
  timeoutProtectionActive: boolean;
  activeJobs: number;
  currentlyScrapingMangas: Array<{
    mangaId: string;
    status: string;
    currentChapter: number | null;
    totalChapters: number;
    completedChapters: number;
    message: string;
    startTime: string;
  }>;
  serverUptime: number;
  timestamp: string;
}

// Find gaps in sorted chapter numbers
function findChapterGaps(chapters: number[]): Array<[number, number]> {
  if (chapters.length === 0) return [];

  const sortedChapters = [...chapters].sort((a, b) => a - b);
  const gaps: Array<[number, number]> = [];

  for (let i = 1; i < sortedChapters.length; i++) {
    const prev = sortedChapters[i - 1];
    const curr = sortedChapters[i];
    if (curr - prev > 1) {
      gaps.push([prev + 1, curr - 1]);
    }
  }
  return gaps;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

function StatusIcon({ status }: { status: ScrapingProgress['status'] }) {
  switch (status) {
    case 'idle':
      return <FaPause className="w-5 h-5 text-default-400" />;
    case 'starting':
      return <Spinner size="sm" />;
    case 'scraping':
      return <FaPlay className="w-5 h-5 text-primary animate-pulse" />;
    case 'completed':
      return <FaCheckCircle className="w-5 h-5 text-success" />;
    case 'error':
      return <MdError className="w-5 h-5 text-danger" />;
    default:
      return <FaPause className="w-5 h-5 text-default-400" />;
  }
}

export default function Page() {
  const { id } = useParams<Props["params"]>();
  const { data, loading, refetch } = useQuery(GET_SCRAP_MANGA, { variables: { id } });
  const [progress, setProgress] = useState<ScrapingProgress | null>(null);
  const [globalStatus, setGlobalStatus] = useState<GlobalStatus | null>(null);
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const scrapUrl = data?.manga?.scrapSources?.asurascans;
  const chapters = data?.manga?.chapters?.map(chapter => chapter.number) || [];
  const chapterGaps = chapters.length > 0 ? findChapterGaps(chapters) : [];

  // Fetch global scraping status
  const fetchGlobalStatus = async () => {
    setStatusLoading(true);
    try {
      const result = await getGlobalScrapingStatus();
      if (result.success && result.data) {
        setGlobalStatus(result.data);
      } else {
        console.error('Failed to fetch global status:', result.error);
      }
    } catch (error) {
      console.error('Error fetching global status:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  // Initial status fetch
  useEffect(() => {
    fetchGlobalStatus();
  }, []);

  // Poll for progress updates when scraping is active
  useEffect(() => {
    if (!isScrapingActive || !id) return;

    const eventSource = new EventSource(`/api/scrap/progress/${id}/stream`);

    eventSource.onmessage = (event) => {
      const progressData = JSON.parse(event.data);
      setProgress(progressData);

      if (progressData.status === 'completed' || progressData.status === 'error') {
        setIsScrapingActive(false);
        refetch();
        fetchGlobalStatus(); // Refresh global status
      }
    };

    eventSource.onerror = () => {
      console.error('SSE connection error');
      setIsScrapingActive(false);
    };

    return () => {
      eventSource.close();
    };
  }, [isScrapingActive, id, refetch]);

  const handleStartScraping = async () => {
    try {
      setIsScrapingActive(true);
      setProgress({
        status: 'starting',
        currentChapter: null,
        totalChapters: 0,
        completedChapters: 0,
        message: 'Initializing...',
        startTime: new Date(),
        errors: []
      });

      await scrapManga(id, scrapUrl ?? "", chapters);
    } catch (error) {
      setIsScrapingActive(false);
      setProgress({
        status: 'error',
        currentChapter: null,
        totalChapters: 0,
        completedChapters: 0,
        message: `Failed to start scraping: ${error}`,
        startTime: new Date(),
        errors: [String(error)]
      });
    }
  };

  const progressPercentage = progress && progress.totalChapters > 0
    ? (progress.completedChapters / progress.totalChapters) * 100
    : 0;

  // Check if scraping is disabled
  const isScrapingBlocked = globalStatus?.isLocked || (globalStatus?.activeJobs ?? 0) > 0;
  const canStartScraping = !isScrapingBlocked && !isScrapingActive && scrapUrl && !statusLoading;

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Spinner size="lg" color="primary" />
              <p className="mt-4 text-lg text-default-600">Loading manga data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <Card isBlurred>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-2xl font-bold text-default-900 flex items-center gap-3">
                  <FaBook className="w-6 h-6 text-primary" />
                  Manga Scraping Dashboard
                </h1>
                <p className="text-default-600 mt-1">Monitor and control chapter scraping process</p>
              </div>
              <Chip
                color={isScrapingActive ? 'warning' : 'success'}
                variant="flat"
                startContent={<StatusIcon status={progress?.status || 'idle'} />}
              >
                {progress?.status.toUpperCase() || 'READY'}
              </Chip>
            </div>
          </CardHeader>
        </Card>

        {/* Global Scraping Status */}
        <Card isBlurred>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaServer className="w-5 h-5 text-primary" />
              Scraping Service Status
              {statusLoading && <Spinner size="sm" />}
            </h2>
          </CardHeader>
          <CardBody>
            {globalStatus ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-default-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {globalStatus.isLocked ? (
                        <FaLock className="w-4 h-4 text-warning" />
                      ) : (
                        <FaCheckCircle className="w-4 h-4 text-success" />
                      )}
                      <p className="text-xs text-default-600">Service Status</p>
                    </div>
                    <p className="text-lg font-semibold">
                      {globalStatus.isLocked ? 'Busy' : 'Available'}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-default-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FaUsers className="w-4 h-4 text-primary" />
                      <p className="text-xs text-default-600">Active Jobs</p>
                    </div>
                    <p className="text-lg font-semibold">
                      {globalStatus.activeJobs}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-default-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FaClock className="w-4 h-4 text-secondary" />
                      <p className="text-xs text-default-600">Server Uptime</p>
                    </div>
                    <p className="text-lg font-semibold">
                      {formatTime(Math.floor(globalStatus.serverUptime))}
                    </p>
                  </div>
                </div>

                {/* Show active scraping jobs */}
                {globalStatus.currentlyScrapingMangas.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MdWarning className="w-4 h-4 text-warning" />
                      <span className="text-sm font-medium text-warning">
                        Currently Scraping ({globalStatus.currentlyScrapingMangas.length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {globalStatus.currentlyScrapingMangas.map((job) => (
                        <div key={job.mangaId} className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">Manga: {job.mangaId}</p>
                              <p className="text-xs text-default-600">{job.message}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-default-600">
                                {job.currentChapter ? `Ch. ${job.currentChapter}` : 'Starting...'}
                              </p>
                              <p className="text-xs text-default-600">
                                {job.completedChapters}/{job.totalChapters}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Warning when scraping is blocked */}
                {isScrapingBlocked && (
                  <Alert
                    color="warning"
                    variant="flat"
                    title="Scraping Service Busy"
                    description="Another scraping operation is currently in progress. Please wait for it to complete before starting a new one."
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Spinner size="md" />
                <p className="mt-2 text-sm text-default-600">Checking scraping service status...</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Source Information */}
        <Card isBlurred>
          <CardHeader>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FaDownload className="w-5 h-5 text-primary" />
              Source Configuration
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-default-600">Scraping URL:</span>
                <div className="font-mono text-sm bg-default-100 p-2 rounded mt-1 break-all">
                  {scrapUrl || 'No scraping URL configured'}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <FaBook className="w-4 h-4 text-primary" />
                  {chapters.length} chapters available
                </span>
                {scrapUrl && canStartScraping && (
                  <Chip size="sm" color="success" variant="flat">
                    Ready to scrape
                  </Chip>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Chapter Gaps Analysis */}
        {chapterGaps.length > 0 && (
          <Card isBlurred>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CgSpaceBetween className="w-5 h-5 text-warning" />
                Chapter Gaps Detected
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FaExclamationTriangle className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium">
                    Found {chapterGaps.length} gap{chapterGaps.length !== 1 ? 's' : ''} in chapter sequence
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {chapterGaps.map((gap, index) => (
                    <Chip
                      key={index}
                      size="sm"
                      color="warning"
                      variant="flat"
                    >
                      {gap[0] === gap[1] ? `Ch. ${gap[0]}` : `Ch. ${gap[0]}-${gap[1]}`}
                    </Chip>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Progress Tracking */}
        {(progress || isScrapingActive) && (
          <Card isBlurred>
            <CardHeader>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaChartLine className="w-5 h-5 text-primary" />
                Scraping Progress
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-default-600">
                    {progress?.completedChapters || 0} / {progress?.totalChapters || 0} chapters
                  </span>
                </div>
                <Progress
                  value={progressPercentage}
                  color={progress?.status === 'error' ? 'danger' : 'primary'}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-default-50 rounded-lg">
                  <p className="text-xs text-default-600">Current Chapter</p>
                  <p className="text-lg font-semibold">
                    {progress?.currentChapter || '-'}
                  </p>
                </div>
                <div className="text-center p-3 bg-default-50 rounded-lg">
                  <p className="text-xs text-default-600">Status</p>
                  <p className="text-lg font-semibold capitalize">
                    {progress?.status || 'Idle'}
                  </p>
                </div>
                <div className="text-center p-3 bg-default-50 rounded-lg">
                  <p className="text-xs text-default-600 flex items-center justify-center gap-1">
                    <FaClock className="w-3 h-3" />
                    ETA
                  </p>
                  <p className="text-lg font-semibold">
                    {progress?.estimatedTimeRemaining
                      ? formatTime(progress.estimatedTimeRemaining)
                      : '-'
                    }
                  </p>
                </div>
              </div>

              <div className="p-3 bg-default-100 rounded-lg">
                <p className="text-sm font-medium mb-1">Current Status:</p>
                <p className="text-sm text-default-700">{progress?.message}</p>
              </div>

              {progress?.errors && progress.errors.length > 0 && (
                <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MdError className="w-4 h-4 text-danger" />
                    <span className="text-sm font-medium text-danger">
                      Errors ({progress.errors.length})
                    </span>
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={onOpen}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* Control Panel */}
        <Card isBlurred>
          <CardHeader>
            <h2 className="text-xl font-semibold">Scraping Controls</h2>
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-default-600">
                  {chapterGaps.length > 0
                    ? `Will scrape ${chapterGaps.length} missing chapters and any new chapters`
                    : 'Will scrape any new chapters available'
                  }
                </p>
                <p className="text-xs text-default-500">
                  {isScrapingBlocked
                    ? 'Waiting for another scraping operation to complete...'
                    : 'Scraping will start automatically and update progress in real-time'
                  }
                </p>
              </div>
              <Button
                color={isScrapingBlocked ? "default" : "primary"}
                size="lg"
                startContent={
                  isScrapingBlocked ? (
                    <FaLock className="w-4 h-4" />
                  ) : (
                    <FaPlay className="w-4 h-4" />
                  )
                }
                onPress={handleStartScraping}
                isDisabled={!canStartScraping}
                isLoading={isScrapingActive}
              >
                {isScrapingBlocked
                  ? 'Service Busy'
                  : isScrapingActive
                    ? 'Scraping...'
                    : 'Start Scraping'
                }
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Error Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalContent>
            <ModalHeader className="flex items-center gap-2">
              <MdError className="w-5 h-5 text-danger" />
              Scraping Errors
            </ModalHeader>
            <ModalBody>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {progress?.errors.map((error, index) => (
                  <div key={index} className="p-3 bg-danger-50 rounded-lg">
                    <p className="text-sm text-danger-800">{error}</p>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
