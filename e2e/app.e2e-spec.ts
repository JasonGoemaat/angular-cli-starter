import { AngularCliStarterPage } from './app.po';

describe('angular-cli-starter App', function() {
  let page: AngularCliStarterPage;

  beforeEach(() => {
    page = new AngularCliStarterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
