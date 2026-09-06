export interface Ping {
  id: string;
  jobId: string;
  receivedAt: Date;
  sourceIp?: string;
}
