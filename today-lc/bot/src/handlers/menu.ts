import { BotContext } from '../types';
import { handleCourses, handleCourseDetail, handleCoursesBack } from './courses';
import { handleEnrollStart } from './enrollment';
import { handleBranches, handleBranchInfo } from './branches';
import { handleContact } from './contact';
import { handleSocial } from './social';
import { handleAbout } from './about';
import { handleChangeLanguage } from './change-language';
import { handleAiAssistant } from '../ai/assistant';

export async function handleMenuSelection(ctx: BotContext, text: string) {
  const t = ctx.t;

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
    default:
      break;
  }
}

export {
  handleCourses,
  handleCourseDetail,
  handleCoursesBack,
  handleEnrollStart,
  handleBranches,
  handleBranchInfo,
  handleContact,
  handleSocial,
  handleAbout,
  handleChangeLanguage,
  handleAiAssistant,
};
