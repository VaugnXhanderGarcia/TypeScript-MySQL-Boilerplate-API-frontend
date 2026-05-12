import { firstValueFrom } from 'rxjs';
import { AccountService } from '../_services';

export function appInitializer(accountService: AccountService) {
  return () =>
    firstValueFrom(accountService.refreshToken())
      .catch(() => null);
}