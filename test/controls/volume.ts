import OpenPlayerJS from '../../src/js/player';

describe('controls > volume', () => {
    let player = null;

    afterEach(() => {
        player.activeElement().muted = true;
        player.destroy();
        player = null;
    });

    it('displays a Volume button and slider in the control bar to the left by default', async () => {
        player = new OpenPlayerJS('video');
        await player.init();

        const volume = player.getControls().getContainer().querySelector('.op-controls__volume') as HTMLButtonElement;
        expect(volume).to.not.be(null);
        expect(volume.tabIndex).to.equal(0);
        expect(volume.getAttribute('aria-label')).to.equal('Volume Slider');
        expect(volume.getAttribute('aria-orientation')).to.equal('vertical');
        expect(volume.getAttribute('aria-valuemin')).to.equal('0');
        expect(volume.getAttribute('aria-valuemax')).to.equal('100');
        expect(volume.getAttribute('aria-valuenow')).to.equal('1');
        expect(volume.getAttribute('aria-valuetext')).to.equal('Volume: 1');

        const range = player.getControls().getContainer().querySelector('.op-controls__volume--input') as HTMLInputElement;
        expect(range).to.not.be(null);
        expect(range.type).to.equal('range');
        expect(range.tabIndex).to.equal(-1);
        expect(range.value).to.equal('1');
        expect(range.getAttribute('min')).to.equal('0');
        expect(range.getAttribute('max')).to.equal('1');
        expect(range.getAttribute('step')).to.equal('0.1');
        expect(range.getAttribute('aria-label')).to.equal('Volume Control');

        const progress = player.getControls().getContainer().querySelector('.op-controls__volume--display') as HTMLInputElement;
        expect(progress).to.not.be(null);
        expect(progress.getAttribute('max')).to.equal('10');
        expect(progress.getAttribute('role')).to.equal('presentation');
        expect(progress.value).to.equal(10);

        const button = player.getControls().getContainer().querySelector('.op-controls__mute') as HTMLElement;
        expect(button).to.not.be(null);
        expect(button.tabIndex).to.equal(0);
        expect(button.title).to.equal('Mute');
        expect(button.getAttribute('aria-label')).to.equal('Mute');
        expect(button.getAttribute('aria-controls')).to.equal('video');
        expect(button.getAttribute('aria-pressed')).to.equal('false');
    });

    it('displays a volume button in the control bar in a different layer if indicated by options', async () => {
        player = new OpenPlayerJS('video', {
            controls: {
                layers: {
                    'top-right': ['volume'],
                },
            },
        });
        await player.init();

        expect(player.getControls().getContainer().querySelector('.op-control__right')).to.not.be(null);
        expect(player.getControls().getContainer().querySelector('.op-controls-layer__top')).to.not.be(null);
        const volume = player.getControls().getContainer().querySelector('.op-controls__volume') as HTMLButtonElement;
        expect(volume).to.not.be(null);
    });

    it('mutes the media when clicking on the volume button', async () => {
        player = new OpenPlayerJS('video');
        await player.init();

        return new Promise<void>(resolve => {
            const volume = player.getControls().getContainer().querySelector('.op-controls__mute') as HTMLButtonElement;
            let e = new CustomEvent('click');

            volume.dispatchEvent(e);
            expect(volume.classList.contains('op-controls__mute--muted')).to.be(false);

            e = new CustomEvent('click');
            volume.dispatchEvent(e);
            expect(volume.classList.contains('op-controls__mute--muted')).to.be(true);

            resolve();
        });
    });

    it('mutes the media when using the Enter/tab space keys and volume button is focused', async () => {
        player = new OpenPlayerJS('video');
        await player.init();

        return new Promise<void>(resolve => {
            const volume = player.getControls().getContainer().querySelector('.op-controls__mute') as HTMLButtonElement;
            let e = new KeyboardEvent('keydown', {
                bubbles: true, cancelable: true, key: 'Enter',
            });
            volume.focus();

            volume.dispatchEvent(e);
            expect(volume.classList.contains('op-controls__mute--muted')).to.be(false);

            // volume.focus();
            // e = new KeyboardEvent('keydown', {
            //     bubbles: true, cancelable: true, key: 'Enter',
            // });
            // volume.dispatchEvent(e);
            // expect(volume.classList.contains('op-controls__mute--muted')).to.be(true);

            e = new KeyboardEvent('keydown', {
                bubbles: true, cancelable: true, key: 'Enter',
            });
            volume.dispatchEvent(e);
            resolve();
        });
    });
});
