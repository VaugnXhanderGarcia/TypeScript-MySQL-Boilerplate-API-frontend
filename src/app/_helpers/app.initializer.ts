import { AccountService } from '../_services';

export function appInitializer(accountService: AccountService) {
  return () => new Promise<void>((resolve) => {
    const currentUrl = window.location.pathname;

    if (currentUrl.includes('/account/verify-email')) {
      resolve();
      return;
    }

    accountService.refreshToken()
      .subscribe()
      .add(resolve);
  });
}