import { Component, OnInit } from '@angular/core';
import { TacheService } from '../taches/taches-service.service';
import { EmployeeService } from '../employee/employee.service';
import { Tache } from 'src/app/back-office/models/tache.model';
import { Employee } from 'src/app/back-office/models/employee.model';
import { PlanningService, Planning } from './planning.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceTime, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css'],
})

export class PlanningComponent implements OnInit {
  taches: Tache[] = [];
  employees: Employee[] = [];
  daysOfWeek: Date[] = [];
  plannings: Planning[] = [];
    currentWeek: Date[] = [];

  constructor(private planningService: PlanningService, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.generateWeekDays();
    this.loadData();
  }

  generateWeekDays() {
    const monday = new Date(); // ou date de base
  monday.setDate(monday.getDate() - monday.getDay() + 1); // Monday

  this.daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
    });
  }
   resetToCurrentWeek(): void {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    this.generateWeek(startOfWeek);
  }

  previousWeek(): void {
    const firstDay = this.currentWeek[0];
    const previous = new Date(firstDay);
    previous.setDate(previous.getDate() - 7);
    this.generateWeek(previous);
  }

  nextWeek(): void {
    const firstDay = this.currentWeek[0];
    const next = new Date(firstDay);
    next.setDate(next.getDate() + 7);
    this.generateWeek(next);
  }

  generateWeek(start: Date): void {
    this.currentWeek = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  getDateRangeLabel(): string {
    const start = this.currentWeek[0];
    const end = this.currentWeek[6];
    return `${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
  }

  loadData() {
    this.employeeService.getAllEmployees().subscribe((employees) => {
      this.employees = employees;
      this.planningService.getAllPlannings().subscribe((plannings) => {
        this.plannings = plannings;
      });
    });
  }

  getEmployeePlanningForDay(employeeId: number, date: Date): Planning[] {
    return this.plannings.filter(p =>
      p.employeeId === employeeId &&
      new Date(p.dateDebut) <= date &&
      new Date(p.dateFin) >= date
    );
  }
  getPlanningClass(type: string): string {
  switch (type.toUpperCase()) {
    case 'REUNION': return 'bg-blue-500';
    case 'FORMATION': return 'bg-yellow-400';
    case 'PROJET': return 'bg-green-500';
    case 'MALADIE': return 'bg-red-500';
    case 'VACANCES': return 'bg-purple-500';
    case 'DEPLACEMENT': return 'bg-pink-400';
    default: return 'bg-gray-400';
  }
}

getPlanningEmoji(type: string): string {
  switch (type.toUpperCase()) {
    case 'REUNION': return '📅';
    case 'FORMATION': return '📚';
    case 'PROJET': return '🧩';
    case 'MALADIE': return '🤒';
    case 'VACANCES': return '🌴';
    case 'DEPLACEMENT': return '✈️';
    default: return '🔖';
  }
}
// Add this to your component.ts file
getShiftTypeClass(shiftType: string): string {
  // Map your shift types to CSS classes
  const typeMap: {[key: string]: string} = {
    'Standard': 'standard',
    'Extra': 'overtime',
    'Night': 'night',
    'Weekend': 'weekend'
    // Add more mappings as needed
  };
  
  return typeMap[shiftType] || 'standard';
}

getDateRange(): string {
  if (this.daysOfWeek && this.daysOfWeek.length > 0) {
    const firstDay = this.daysOfWeek[0];
    const lastDay = this.daysOfWeek[this.daysOfWeek.length - 1];
    return `${firstDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;
  }
  return 'No date range available';
}

}

