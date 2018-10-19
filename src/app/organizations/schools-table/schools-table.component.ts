import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { OrganizationService } from '../../app.services-list';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';
import { Observable } from 'rxjs/Observable';
import { Organization } from '../../_models/organization.model';
import { Router } from '@angular/router';
import { ToastService } from '../../_services/toast.service';

@Component({
  selector: 'app-schools-table',
  templateUrl: './schools-table.component.html',
  styleUrls: ['./schools-table.component.scss']
})
export class SchoolsTableComponent implements OnInit {
  @ViewChild('scrollVariable')
  private scrollableContainer: ElementRef;
  private moreContentAvailable = true;
  public infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  public searchText: string;
  public loading = false;

  organizations: Model.Organization[];

  constructor(private http: Http,
    private organizationService: OrganizationService,
    public router: Router,
    public toastService: ToastService
  ) { }

  ngOnInit() {
    this.getOrganizations();
    this.organizations = [];
    this.searchText = '';
    this.offset = 0;
    this.limit = 50;
  }

  searchItems(): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getOrganizations();
  }

  getOrganizations(): void {
    this.loading = true;
    this.organizationService.getOrganizationSearch('school', 0, this.limit, this.searchText).subscribe((res) => {
      this.loading = false;
      this.organizations = res.map(organization => organization);
      this.offset += res.length;
    }, (errors) => {
      this.loading = false;
      this.toastService.showError('Server error');;
    });
  }

  editOrganization(organization_id: string, type: string): void {
    this.router.navigate([`organizationedit/${organization_id}`, { type: 'school' }]);
  }

  myScrollCallBack(): Observable<Organization[]> {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;

      return this.organizationService.getOrganizationSearch('school', this.limit).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res): void {
    res.map(organization => {
      this.organizations.push(organization);
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }

}
