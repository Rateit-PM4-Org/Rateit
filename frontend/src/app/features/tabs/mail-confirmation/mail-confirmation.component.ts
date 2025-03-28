import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mail-confirmation',
  templateUrl: './mail-confirmation.component.html',
  styleUrls: ['./mail-confirmation.component.scss'],
  standalone: true,
})
export class MailConfirmationComponent  implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || '';
    const token = urlParams.get('token') || '';

    this.userService.confirmEmail(email, token).subscribe(
      {
        next: (response) => {
          console.log('Email confirmed successfully:', response);
          this.router.navigate(['/login'], { queryParams: { emailConfirmed: true } });
        },
        error: (error) => {
          console.error('Error confirming email:', error.error);
        },
      }
    );
  }

}
