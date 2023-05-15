<?php

namespace MageSuite\ContentConstructorAdmin\Test\TestCase;

class CreateLandingPageTest extends \Magento\Mtf\TestCase\Injectable
{
    /**
     * CmsIndex page.
     *
     * @var \Magento\Cms\Test\Page\Adminhtml\CmsPageIndex
     */
    protected $cmsIndex;

    /**
     * CmsPageNew page.
     *
     * @var \Magento\Cms\Test\Page\Adminhtml\CmsPageNew
     */
    protected $cmsNew;

    public function __inject(
        \Magento\Cms\Test\Page\Adminhtml\CmsPageIndex $cmsIndex,
        \Magento\Cms\Test\Page\Adminhtml\CmsPageNew $cmsPageNew
    )
    {
        $this->cmsIndex = $cmsIndex;
        $this->cmsNew = $cmsPageNew;
    }

    public function test(\MageSuite\ContentConstructorAdmin\Test\Fixture\LandingPage $landingPage)
    {
        $page = $landingPage->getPage();
        $components = $landingPage->getComponents();

        $this->cmsNew->open(['page_id' => $page->getPageId()]);
        $this->cmsNew->getPageForm()->openTab('content');
        $this->cmsNew->getContentConstructorBlock()->removeAllExistingComponents();
        $this->cmsNew->getContentConstructorBlock()->addComponents($components);

        $this->cmsNew->getPageMainActions()->saveAndContinue();

        return ['page' => $page, 'components' => $components];
    }
}
