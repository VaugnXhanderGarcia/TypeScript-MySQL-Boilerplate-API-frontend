import { AccountService } from '../_services';
import { catchError, of } from 'rxjs';

export function appInitializer(accountService: AccountService) {
  return () =>
    new Promise<void>((resolve) => {
      accountService.refreshToken()
        .pipe(
          catchError(() => {
            return of(null);
          })
        )
        .subscribe(() => {
          resolve();
        });
    });
}