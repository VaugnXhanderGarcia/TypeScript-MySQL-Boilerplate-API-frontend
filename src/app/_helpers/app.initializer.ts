import { AccountService } from '../_services';

export function appInitializer(accountService: AccountService) {
  return () => new Promise(resolve => {
    const publicUrls = [
      '/account/login',
      '/account/register',
      '/account/forgot-password',
      '/account/reset-password',
      '/account/verify-email'
    ];

    const currentPath = window.location.pathname;

    if (publicUrls.some(url => currentPath.startsWith(url))) {
      resolve(true);
      return;
    }

    accountService.refreshToken()
      .subscribe({
        next: () => resolve(true),
        error: () => resolve(true)
      });
  });
}