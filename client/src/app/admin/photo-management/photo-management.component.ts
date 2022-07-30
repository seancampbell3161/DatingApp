import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Photo } from 'src/app/_models/photo';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {

  photos: Photo[] = [];

  constructor(private adminService: AdminService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
    this.adminService.getPhotosForApproval().subscribe(photos => {
      this.photos = photos
    });
  }

  approvePhoto(id: number) {
    this.adminService.approvePhoto(id).subscribe(
      res => this.toastr.success('Successfully approved photo'),
      error => this.toastr.error('Error approving photo')
    );
  }

  rejectPhoto(id: number) {
    this.adminService.rejectPhoto(id).subscribe(
      res => this.toastr.success('Successfully rejected photo'),
      error => this.toastr.error('Error rejecting photo')
    );
  }

}
