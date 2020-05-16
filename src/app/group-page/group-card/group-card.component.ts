import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.css']
})
export class GroupCardComponent implements OnInit {
  @Input() leaderName: string;
  @Input() groupId: number;
  constructor() { }

  ngOnInit(): void {
  }

}
