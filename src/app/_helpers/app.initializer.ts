import { catchError, of } from 'rxjs';
import { AccountService } from '../_services';

export function appInitializer(accountService: AccountService) {
  return () =>
    new Promise<void>((resolve) => {
      accountService.refreshToken().subscribe({
        next: () => resolve(),
        error: () => resolve()
      });
    });
}