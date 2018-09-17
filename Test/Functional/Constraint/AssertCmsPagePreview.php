<?php

namespace MageSuite\ContentConstructorAdmin\Test\Constraint;

class AssertCmsPagePreview extends \Magento\Mtf\Constraint\AbstractConstraint
{

    /**
     * @var AssertionRegexBuilderFactory
     */
    private $assertionRegexBuilderFactory = null;

    /**
     * Assert that landing page contains all components defined in Content Constructor
     *
     *
     * @return void
     */
    public function processAssert(
        AssertionRegexBuilderFactory $assertionRegexBuilderFactory,
        \Magento\Cms\Test\Page\Adminhtml\CmsPageIndex $cmsIndex,
        \Magento\Mtf\Client\BrowserInterface $browser,
        $page,
        $components
    ) {
        $this->assertionRegexBuilderFactory = $assertionRegexBuilderFactory;

        $cmsIndex->open();
        $filter = ['title' => $page->getTitle()];
        $cmsIndex->getCmsPageGridBlock()->searchAndPreview($filter);

        \PHPUnit\Framework\Assert::assertRegExp(
            $this->buildRegex($components),
            $browser->find('.main')->getText()
        );
    }

    private function buildRegex($components)
    {
        $regex = '';

        foreach ($components as $component) {
            $regexBuilder = $this->assertionRegexBuilderFactory->create($component['type']);

            $regex .= $regexBuilder->buildRegex($component['data']).'(.*?)';
        }

        return '/' . $regex . '/si';
    }

    /**
     * Returns a string representation of the object.
     *
     * @return string
     */
    public function toString()
    {
        return 'CMS page content contains all selected components';
    }
}