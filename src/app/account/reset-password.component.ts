import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: false,
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    if (token) {
      this.router.navigate(['/profile'], { queryParams: { resetToken: token } });
    } else {
      this.router.navigate(['/account/login']);
    }
  }
}