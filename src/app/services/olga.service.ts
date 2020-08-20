import { Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameScoreAnnotation, GameScoreVariation } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class OlgaService {
  @Output() readonly annotations = new BehaviorSubject<GameScoreAnnotation[]>([]);
  @Output() readonly showingPly = new BehaviorSubject<boolean>(true);
  @Output() readonly showingHalfPly = new BehaviorSubject<boolean>(false);
  @Output() readonly variation = new BehaviorSubject<GameScoreVariation[]>([]);
  constructor() { }
}
