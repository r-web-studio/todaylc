export async function handleMenuSelection(ctx: any, text: string) {
  const t = ctx.t;
  const { handleCourses, handleCourseDetail } = require('./courses');
  const { handleEnrollStart } = require('./enrollment');
  const { handleBranches, handleBranchInfo } = require('./branches');
  const { handleContact } = require('./contact');
  const { handleSocial } = require('./social');
  const { handleAbout } = require('./about');
  const { handleChangeLanguage } = require('./change-language');
  const { handleAiAssistant } = require('../ai/assistant');

  switch (text) {
    case t('menu.courses'):
      await handleCourses(ctx);
      break;
    case t('menu.ai_assistant'):
      await handleAiAssistant(ctx);
      break;
    case t('menu.enroll'):
      await handleEnrollStart(ctx);
      break;
    case t('menu.branches'):
      await handleBranches(ctx);
      break;
    case t('menu.contact'):
      await handleContact(ctx);
      break;
    case t('menu.social'):
      await handleSocial(ctx);
      break;
    case t('menu.about'):
      await handleAbout(ctx);
      break;
    case t('menu.change_language'):
      await handleChangeLanguage(ctx);
      break;
  }
}
