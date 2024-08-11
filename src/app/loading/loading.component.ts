import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  isLoading: boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadData().then(() => {
      this.isLoading = false;
      // Redirect to the login component after data loading is completed
      this.router.navigate(['/login']); // Replace 'login' with your actual login component path
    });
  }

  loadData(): Promise<void> {
    // Simulate async data loading
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Your data loading logic here
        resolve();
      }, 3000); // Simulated loading time (2 seconds)
    });
  }
}
