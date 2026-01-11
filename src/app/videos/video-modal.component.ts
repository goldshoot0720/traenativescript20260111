import { Component } from '@angular/core';
import { ModalDialogParams } from '@nativescript/angular';

@Component({
    selector: 'video-modal',
    template: `
        <GridLayout rows="auto, *" style="background-color: black;">
            <StackLayout row="0" class="p-10" horizontalAlignment="right">
                 <Label text="&#xf00d;" class="fas" style="font-size: 30; color: white;" (tap)="close()"></Label>
            </StackLayout>
            <Video
                row="1"
                [src]="videoUrl"
                autoplay="true"
                controls="true"
                height="100%"
                width="100%"
                fill="true">
            </Video>
        </GridLayout>
    `
})
export class VideoModalComponent {
    videoUrl: string;

    constructor(private params: ModalDialogParams) {
        this.videoUrl = params.context.url;
    }

    close() {
        this.params.closeCallback();
    }
}
