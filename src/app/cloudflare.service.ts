import { Service, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Service()
export class CloudflareService {
  private challengePassVersion = 0;

  /** Whether any API request is currently blocked */
  readonly isBlocked = signal(false);

  /** Transient event stream to trigger API retries upon passing Turnstile */
  readonly challengePassed$: Subject<void | undefined> = new Subject();

  notifyBlocked() {
    this.isBlocked.set(true);
  }

  notifyPassed() {
    this.challengePassVersion++;
    this.isBlocked.set(false);
    this.challengePassed$.next();
  }

  getChallengePassVersion(): number {
    return this.challengePassVersion;
  }

  hasChallengePassedSince(version: number): boolean {
    return this.challengePassVersion > version;
  }
}
