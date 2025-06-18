import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Progress,
  Divider,
  Spinner,
} from "@heroui/react";
import {
  FaServer,
  FaSync,
  FaHeart,
  FaDesktop,
  FaBrain,
  FaBolt,
  FaHdd,
  FaCog,
  FaSpider,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaCircle,
  FaClock,
  FaMemory,
  FaMicrochip,
  FaDatabase
} from "react-icons/fa";
import {
  MdError,
  MdWarning,
  MdCheckCircle
} from "react-icons/md";
import { Suspense } from "react";
import {fetchStatus} from "@/app/(pages)/[locale]/scrap/status/actions";
import {Link} from "@/i18n/routing";
import {LogsLink} from "@/app/(pages)/[locale]/scrap/status/_components/LogsLink";

export const revalidate = 0;

export interface ServerStatus {
  server: {
    status: 'healthy' | 'degraded' | 'error';
    uptime: {
      seconds: number;
      formatted: string;
      startTime: string;
    };
    timestamp: string;
    timezone: string;
    port: number;
    pid: number;
  };
  scraping: {
    inProgress: boolean;
    timeoutProtectionActive: boolean;
    chromiumAvailable: boolean;
    lastActivity: string;
  };
  system: {
    platform: string;
    arch: string;
    hostname: string;
    nodeVersion: string;
    memory: {
      used: string;
      total: string;
      external: string;
      systemTotal: string;
      systemFree: string;
    };
    cpu: {
      loadAverage: number[];
      cores: number;
      usage: number;
    };
    disk: {
      total: string;
      used: string;
      free: string;
      usagePercent: string;
    } | { error: string };
  };
  environment: {
    nodeEnv: string;
    hasMainAppUrl: boolean;
    hasApiToken: boolean;
    logDirectory: string;
    tempDirectory: string;
  };
  health: {
    memoryUsage: boolean;
    diskSpace: boolean;
    logDirectory: boolean;
    environment: boolean;
    chromium: boolean;
    overall: boolean;
  };
  version: string;
}

function StatusChip({ status }: { status: 'healthy' | 'degraded' | 'error' }) {
  const colorMap = {
    healthy: 'success' as const,
    degraded: 'warning' as const,
    error: 'danger' as const
  };

  const IconMap = {
    healthy: MdCheckCircle,
    degraded: MdWarning,
    error: MdError
  };

  const IconComponent = IconMap[status];

  return (
    <Chip
      color={colorMap[status]}
      variant="flat"
      startContent={<IconComponent className="w-4 h-4" />}
      className="text-sm font-medium"
    >
      {status.toUpperCase()}
    </Chip>
  );
}

function HealthIndicator({ isHealthy, label }: { isHealthy: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-default-600">{label}</span>
      <Chip
        size="sm"
        color={isHealthy ? 'success' : 'danger'}
        variant="flat"
        startContent={
          isHealthy ?
            <FaCheckCircle className="w-3 h-3" /> :
            <FaTimesCircle className="w-3 h-3" />
        }
      >
        {isHealthy ? 'OK' : 'FAIL'}
      </Chip>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Spinner size="lg" color="primary" />
            <p className="mt-4 text-lg text-default-600">Loading scraping service status...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Card className="max-w-md mx-auto mt-20">
          <CardHeader className="text-center">
            <div className="w-full flex items-center justify-center gap-2">
              <MdError className="w-6 h-6 text-danger" />
              <h1 className="text-2xl font-bold text-danger">Service Unavailable</h1>
            </div>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600 mb-4">
              Unable to connect to the scraping service. Please check if the service is running.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

async function StatusContent() {
  const status = await fetchStatus();

  if (!status) {
    return <ErrorState />;
  }

  const memoryUsedPercent = status.system.memory.used && status.system.memory.total
    ? (parseInt(status.system.memory.used) / parseInt(status.system.memory.total)) * 100
    : 0;

  const diskUsedPercent = 'usagePercent' in status.system.disk
    ? parseInt(status.system.disk.usagePercent)
    : 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-default-900 flex items-center gap-3">
                <FaSpider className="w-8 h-8 text-primary" />
                Scraping Service Status
              </h1>
              <p className="text-default-600 mt-1">
                Real-time monitoring dashboard
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusChip status={status.server.status} />
              <Chip variant="flat" color="default" startContent={<FaCog className="w-3 h-3" />}>
                v{status.version}
              </Chip>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Server Info - Left Column */}
          <div className="lg:col-span-4 space-y-6">

            {/* Server Status */}
            <Card isBlurred>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FaServer className="w-5 h-5 text-primary" />
                  Server Status
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-default-600 flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      Uptime
                    </p>
                    <p className="font-mono text-sm">{status.server.uptime.formatted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-600">PID</p>
                    <p className="font-mono text-sm">{status.server.pid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Port</p>
                    <p className="font-mono text-sm">{status.server.port}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Timezone</p>
                    <p className="font-mono text-sm">{status.server.timezone}</p>
                  </div>
                </div>
                <Divider />
                <div>
                  <p className="text-sm text-default-600">Last Updated</p>
                  <p className="font-mono text-xs">
                    {new Date(status.server.timestamp).toLocaleString()}
                  </p>
                </div>
                <Divider />
                <LogsLink />
              </CardBody>
            </Card>

            {/* Scraping Status */}
            <Card isBlurred>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FaSync className="w-5 h-5 text-primary" />
                  Scraping Status
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-default-600">Scraping Active</span>
                    <Chip
                      size="sm"
                      color={status.scraping.inProgress ? 'warning' : 'success'}
                      variant="flat"
                      startContent={
                        status.scraping.inProgress ?
                          <FaSync className="w-3 h-3 animate-spin" /> :
                          <FaCircle className="w-3 h-3" />
                      }
                    >
                      {status.scraping.inProgress ? 'IN PROGRESS' : 'IDLE'}
                    </Chip>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-default-600">Timeout Protection</span>
                    <Chip
                      size="sm"
                      color={status.scraping.timeoutProtectionActive ? 'primary' : 'default'}
                      variant="flat"
                    >
                      {status.scraping.timeoutProtectionActive ? 'ACTIVE' : 'INACTIVE'}
                    </Chip>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-default-600">Chromium Available</span>
                    <Chip
                      size="sm"
                      color={status.scraping.chromiumAvailable ? 'success' : 'danger'}
                      variant="flat"
                      startContent={
                        status.scraping.chromiumAvailable ?
                          <FaCheckCircle className="w-3 h-3" /> :
                          <FaTimesCircle className="w-3 h-3" />
                      }
                    >
                      {status.scraping.chromiumAvailable ? 'READY' : 'UNAVAILABLE'}
                    </Chip>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Health Checks */}
            <Card isBlurred>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FaHeart className="w-5 h-5 text-danger" />
                  Health Checks
                </h2>
              </CardHeader>
              <CardBody className="space-y-3">
                <HealthIndicator
                  isHealthy={status.health.memoryUsage}
                  label="Memory Usage"
                />
                <HealthIndicator
                  isHealthy={status.health.diskSpace}
                  label="Disk Space"
                />
                <HealthIndicator
                  isHealthy={status.health.logDirectory}
                  label="Log Directory"
                />
                <HealthIndicator
                  isHealthy={status.health.environment}
                  label="Environment"
                />
                <HealthIndicator
                  isHealthy={status.health.chromium}
                  label="Chromium"
                />
                <Divider />
                <div className="flex items-center justify-between font-medium">
                  <span>Overall Health</span>
                  <Chip
                    color={status.health.overall ? 'success' : 'danger'}
                    variant="flat"
                    startContent={
                      status.health.overall ?
                        <FaCheckCircle className="w-3 h-3" /> :
                        <FaExclamationTriangle className="w-3 h-3" />
                    }
                  >
                    {status.health.overall ? 'HEALTHY' : 'DEGRADED'}
                  </Chip>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* System Info - Right Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* System Overview */}
            <Card isBlurred>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FaDesktop className="w-5 h-5 text-primary" />
                  System Information
                </h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-default-600">Platform</p>
                    <p className="font-mono">{status.system.platform}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Architecture</p>
                    <p className="font-mono">{status.system.arch}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Hostname</p>
                    <p className="font-mono text-sm">{status.system.hostname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Node Version</p>
                    <p className="font-mono">{status.system.nodeVersion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-600">CPU Cores</p>
                    <p className="font-mono">{status.system.cpu.cores}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Environment</p>
                    <p className="font-mono">{status.environment.nodeEnv}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Memory Usage */}
            <Card isBlurred>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FaBrain className="w-5 h-5 text-primary" />
                  Memory Usage
                </h2>
              </CardHeader>
              <CardBody className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-1">
                      <FaMemory className="w-3 h-3" />
                      Heap Memory
                    </span>
                    <span>{status.system.memory.used} / {status.system.memory.total}</span>
                  </div>
                  <Progress
                    value={memoryUsedPercent}
                    color={memoryUsedPercent > 80 ? 'danger' : memoryUsedPercent > 60 ? 'warning' : 'success'}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-default-600">External</p>
                    <p className="font-mono">{status.system.memory.external}</p>
                  </div>
                  <div>
                    <p className="text-default-600">System Total</p>
                    <p className="font-mono">{status.system.memory.systemTotal}</p>
                  </div>
                  <div>
                    <p className="text-default-600">System Free</p>
                    <p className="font-mono">{status.system.memory.systemFree}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* CPU & Disk */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* CPU Usage */}
              <Card isBlurred>
                <CardHeader>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FaBolt className="w-5 h-5 text-warning" />
                    CPU Info
                  </h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div>
                    <p className="text-sm text-default-600 mb-2 flex items-center gap-1">
                      <FaMicrochip className="w-3 h-3" />
                      Load Average
                    </p>
                    <div className="space-y-2">
                      {status.system.cpu.loadAverage.map((load, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-xs w-8">{index === 0 ? '1m' : index === 1 ? '5m' : '15m'}</span>
                          <Progress
                            value={Math.min(load * 20, 100)}
                            color={load > 2 ? 'danger' : load > 1 ? 'warning' : 'success'}
                            size="sm"
                            className="flex-1"
                          />
                          <span className="text-xs font-mono w-12">{load}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-default-600">CPU Usage</p>
                    <p className="font-mono">{status.system.cpu.usage}ms</p>
                  </div>
                </CardBody>
              </Card>

              {/* Disk Usage */}
              <Card isBlurred>
                <CardHeader>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FaHdd className="w-5 h-5 text-primary" />
                    Disk Usage
                  </h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  {'error' in status.system.disk ? (
                    <div className="text-center text-danger flex items-center justify-center gap-2">
                      <MdError className="w-5 h-5" />
                      <p>Unable to read disk usage</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="flex items-center gap-1">
                            <FaDatabase className="w-3 h-3" />
                            Storage
                          </span>
                          <span>{status.system.disk.used} / {status.system.disk.total}</span>
                        </div>
                        <Progress
                          value={diskUsedPercent}
                          color={diskUsedPercent > 90 ? 'danger' : diskUsedPercent > 75 ? 'warning' : 'success'}
                          className="w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-default-600">Free Space</p>
                          <p className="font-mono">{status.system.disk.free}</p>
                        </div>
                        <div>
                          <p className="text-default-600">Usage %</p>
                          <p className="font-mono">{status.system.disk.usagePercent}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </div>

            {/* Environment Variables */}
            <Card isBlurred>
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FaCog className="w-5 h-5 text-primary" />
                  Environment
                </h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-default-600">Main App URL</span>
                    <Chip
                      size="sm"
                      color={status.environment.hasMainAppUrl ? 'success' : 'danger'}
                      variant="flat"
                      startContent={
                        status.environment.hasMainAppUrl ?
                          <FaCheckCircle className="w-3 h-3" /> :
                          <FaTimesCircle className="w-3 h-3" />
                      }
                    >
                      {status.environment.hasMainAppUrl ? 'SET' : 'MISSING'}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-default-600">API Token</span>
                    <Chip
                      size="sm"
                      color={status.environment.hasApiToken ? 'success' : 'danger'}
                      variant="flat"
                      startContent={
                        status.environment.hasApiToken ?
                          <FaCheckCircle className="w-3 h-3" /> :
                          <FaTimesCircle className="w-3 h-3" />
                      }
                    >
                      {status.environment.hasApiToken ? 'SET' : 'MISSING'}
                    </Chip>
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Log Directory</p>
                    <p className="font-mono text-xs">{status.environment.logDirectory}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <StatusContent />
    </Suspense>
  );
}
