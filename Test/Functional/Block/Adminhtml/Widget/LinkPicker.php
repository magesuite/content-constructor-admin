<?php

namespace MageSuite\ContentConstructorAdmin\Test\Block\Adminhtml\Widget;

class LinkPicker extends \Magento\Mtf\Block\Block
{
    private $chooserButtonSelector = '.btn-chooser';

    private $widgetTypes = [
        'product' => 'Catalog Product Link',
        'category' => 'Catalog Category Link',
        'cmsPage' => 'CMS Page Link',
    ];

    private $addWidgetButtonSelector = '.add-widget';

    private $categoryInTreeSelector = "//span[contains(text(),'%s')]/parent::a";

    private $gridSelector = "//div[contains(@id,'responseCntoptions')]";

    /**
     * Pick widget with link to entity:
     * - Product
     * - Category
     * - CmsPage
     * @param $entity \Magento\Catalog\Test\Fixture\CatalogProductSimple|\Magento\Catalog\Test\Fixture\Category|\Magento\Cms\Test\Fixture\CmsPage
     */
    public function pick($entity) {
        switch (get_class($entity)) {
            case 'Magento\Catalog\Test\Fixture\CatalogProductSimple':
                $this->selectProductLinkWidget($entity);
                break;
            case 'Magento\Catalog\Test\Fixture\Category':
                $this->selectCategoryLinkWidget($entity);
                break;
            case 'Magento\Cms\Test\Fixture\CmsPage':
                $this->selectCmsPageLinkWidget($entity);
                break;
        }

        $this->browser->find($this->addWidgetButtonSelector)->click();
    }

    private function selectProductLinkWidget(\Magento\Catalog\Test\Fixture\CatalogProductSimple $product)
    {
        $this->selectWidgetType('product');

        $this->browser->find($this->chooserButtonSelector)->click();

        /** @var \Magento\Backend\Test\Block\Widget\Grid $grid */
        $gridElement = $this->browser
            ->find($this->gridSelector, \Magento\Mtf\Client\Locator::SELECTOR_XPATH);

        $grid = $this->blockFactory->create(
            \Magento\Widget\Test\Block\Adminhtml\Widget\Instance\Edit\Tab\WidgetInstanceType\Product\Grid::class,
            ['element' => $gridElement]
        );

        $grid->search(['sku' => $product->getSku()]);

        $this->clickFirstRow($grid);
    }


    private function selectCategoryLinkWidget(\Magento\Catalog\Test\Fixture\Category $category)
    {
        $this->selectWidgetType('category');
        $this->browser->find('.btn-chooser')->click();

        $category = $this->browser->find(
            sprintf($this->categoryInTreeSelector, $category->getName()),
            \Magento\Mtf\Client\Locator::SELECTOR_XPATH
        );

        $category->click();
    }

    private function selectCmsPageLinkWidget(\Magento\Cms\Test\Fixture\CmsPage $page)
    {
        $this->selectWidgetType('cmsPage');

        $this->browser->find($this->chooserButtonSelector)->click();

        /** @var \Magento\Widget\Test\Block\Adminhtml\Widget\Instance\Edit\Tab\ParametersType\CmsPageLink\Grid $grid */
        $grid = $this->blockFactory->create(
            \Magento\Widget\Test\Block\Adminhtml\Widget\Instance\Edit\Tab\ParametersType\CmsPageLink\Grid::class,
            ['element' => $this->browser->find($this->gridSelector, \Magento\Mtf\Client\Locator::SELECTOR_XPATH)]
        );

        $grid->search(['title' => $page->getTitle()]);

        $this->clickFirstRow($grid);
    }

    private function selectWidgetType($type)
    {
        $this->browser
            ->find('#select_widget_type', \Magento\Mtf\Client\Locator::SELECTOR_CSS, 'select')
            ->setValue($this->widgetTypes[$type]);
    }

    /**
     * @param $grid
     */
    private function clickFirstRow($grid)
    {
        $grid->_rootElement->find('tbody tr')->click();
    }
}
