import { Component, output, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { delay, filter, finalize, map, merge, take, timer } from 'rxjs';

const LAUNCH_PROMPT = "Launch Prompt: 'Out of Reach'";

const PROMPT_MESSAGES = [
    '...',
    'Hello little creature.',
    'What do you have there?',
    '...',
    'I think the rain is approaching.',
    'You should come inside.',
    "You're safe here.",
    '...',
    LAUNCH_PROMPT
];

const FIRST_OPEN_DLEAY = 1000;
const OPEN_EVERY = 4500;
const CLOSE_AFTER = 4000;

const SEEN_PROMPT_KEY = 'seen_welcome_prompt';
@Component({
    selector: 'app-prompt',
    standalone: true,
    imports: [MatIconModule, RouterLink],
    templateUrl: './prompt.component.html',
    styleUrl: './prompt.component.scss'
})
export class PromptComponent {
    closed = output();

    open: Signal<boolean>;
    message: Signal<string>;

    constructor() {
        const prompt = this.getPrompt();

        const open$ = timer(FIRST_OPEN_DLEAY, OPEN_EVERY).pipe(map(() => true));
        const close$ = open$.pipe(
            delay(CLOSE_AFTER),
            map(() => false)
        );

        const openClosed$ = merge(open$, close$).pipe(
            // count = open + close emits -1, to not close the last one
            take(prompt.length * 2 - 1)
        );

        const message$ = openClosed$.pipe(
            filter(Boolean),
            take(prompt.length),
            map((_, idx) => prompt[idx]),
            finalize(() => this.setAsSeen())
        );

        this.open = toSignal(openClosed$, { initialValue: false });
        this.message = toSignal(message$, { initialValue: '' });
    }

    close(): void {
        this.setAsSeen();
        this.closed.emit();
    }

    getPrompt(): string[] {
        const hasSeenMessage = !!localStorage.getItem(SEEN_PROMPT_KEY);
        return hasSeenMessage ? [LAUNCH_PROMPT] : PROMPT_MESSAGES;
    }

    hasSeenPrompt(): boolean {
        return !!localStorage.getItem(SEEN_PROMPT_KEY);
    }

    setAsSeen(): void {
        localStorage.setItem(SEEN_PROMPT_KEY, 'true');
    }
}
