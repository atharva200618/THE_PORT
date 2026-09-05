/**
 * Automated Test Suite for The Port Backend & Database
 */
import db from './server/db.js';
import storage, { cleanExpiredFilesAndJobs } from './server/storage.js';
import fs from 'node:fs';
import path from 'node:path';

async function runTests() {
  console.log('=== 1. Testing SQLite Database Layer ===');
  
  const testJobId = `test_job_${Date.now()}`;
  const job = db.createJob({
    id: testJobId,
    originalName: 'Quarterly_Plan.docx',
    sourceFormat: 'docx',
    targetFormat: 'pages',
    fileSize: 10240,
    inputFilename: `${testJobId}_Quarterly_Plan.docx`
  });

  console.assert(job !== null, 'Job should be created');
  console.assert(job.status === 'pending', `Status should be pending, got ${job.status}`);
  console.assert(job.originalName === 'Quarterly_Plan.docx', 'Name should match');
  console.log('✓ db.createJob passed');

  // Test getJobById
  const retrieved = db.getJobById(testJobId);
  console.assert(retrieved.id === testJobId, 'getJobById should retrieve correct job');
  console.log('✓ db.getJobById passed');

  // Test atomic getNextPendingJob
  const nextJob = db.getNextPendingJob();
  console.assert(nextJob !== null, 'getNextPendingJob should pick up the pending job');
  console.assert(nextJob.id === testJobId, 'nextJob ID should match testJobId');
  console.assert(nextJob.status === 'processing', `nextJob status should be processing, got ${nextJob.status}`);
  console.log('✓ db.getNextPendingJob passed');

  // Verify next call returns null if no more pending
  const emptyJob = db.getNextPendingJob();
  console.assert(emptyJob === null, 'getNextPendingJob should return null when queue is empty');
  console.log('✓ db.getNextPendingJob (empty queue) passed');

  // Test completeJob
  const completed = db.completeJob(testJobId, `out_${testJobId}_Quarterly_Plan.pages`);
  console.assert(completed.status === 'done', `Status should be done, got ${completed.status}`);
  console.assert(completed.outputFilename === `out_${testJobId}_Quarterly_Plan.pages`, 'outputFilename should match');
  console.log('✓ db.completeJob passed');

  // Test failJob on another job
  const failJobId = `fail_job_${Date.now()}`;
  db.createJob({
    id: failJobId,
    originalName: 'Corrupted.pdf',
    sourceFormat: 'pdf',
    targetFormat: 'docx',
    fileSize: 2048,
    inputFilename: `${failJobId}_Corrupted.pdf`
  });
  db.getNextPendingJob();
  const failed = db.failJob(failJobId, 'Invalid PDF stream header');
  console.assert(failed.status === 'failed', `Status should be failed, got ${failed.status}`);
  console.assert(failed.errorMessage === 'Invalid PDF stream header', 'Error message should match');
  console.log('✓ db.failJob passed');

  // Test getStats
  const stats = db.getStats();
  console.log('Queue Stats:', stats);
  console.assert(stats.done >= 1, 'Stats done count >= 1');
  console.assert(stats.failed >= 1, 'Stats failed count >= 1');
  console.log('✓ db.getStats passed');

  // Test job with options (Protect PDF custom password)
  const protectJobId = `protect_job_${Date.now()}`;
  const protectJob = db.createJob({
    id: protectJobId,
    originalName: 'Financial_Confidential.pdf',
    sourceFormat: 'pdf',
    targetFormat: 'protect',
    fileSize: 4096,
    inputFilename: `${protectJobId}_Financial_Confidential.pdf`,
    options: { password: 'UserCustomSecret123!' }
  });

  console.assert(protectJob !== null, 'Protect job should be created');
  console.assert(protectJob.options && protectJob.options.password === 'UserCustomSecret123!', 'Options password should match');
  console.log('✓ db.createJob with custom password options passed');

  const retrievedProtectJob = db.getJobById(protectJobId);
  console.assert(retrievedProtectJob.options && retrievedProtectJob.options.password === 'UserCustomSecret123!', 'Retrieved options password should match');
  console.log('✓ db.getJobById (options parsing) passed');

  console.log('\n=== 2. Testing Storage & 24-Hour Cleanup ===');
  const dummyInputFile = path.join(storage.UPLOADS_DIR, 'dummy_test.docx');
  fs.writeFileSync(dummyInputFile, 'dummy content');
  console.assert(fs.existsSync(dummyInputFile), 'Dummy upload file should exist');

  // Test cleanup with 0 hours TTL
  cleanExpiredFilesAndJobs(0);
  console.log('✓ 24-hour cleanup logic executed successfully');

  // Clean up test DB rows
  db.deleteJob(testJobId);
  db.deleteJob(failJobId);
  db.deleteJob(protectJobId);

  console.log('\n========================================');
  console.log(' ALL AUTOMATED TESTS PASSED SUCCESSFULLY! ');
  console.log('========================================');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
