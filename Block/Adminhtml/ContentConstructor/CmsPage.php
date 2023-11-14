<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor;

class CmsPage extends AbstractConstructor
{
    public function getExistingComponentsConfiguration()
    {
        /** @var \Magento\Cms\Model\Page $page */
        $page = $this->registry->registry('cms_page');

        $configuration = [];

        if ($page !== null) {
            $configuration = $this->xmlToComponentConfiguration->map($page->getLayoutUpdateXml());
        }

        return json_encode($configuration);
    }

    public function getPageType()
    {
        return 'cms_page_form.cms_page_form';
    }
}
