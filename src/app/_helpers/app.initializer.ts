import { AccountService } from '../_services';

export function appInitializer(accountService: AccountService) {
  return () =>
    new Promise(resolve => {
      accountService.refreshToken().subscribe({
        next: () => resolve(true),
        error: () => resolve(true)
      });
    });
}