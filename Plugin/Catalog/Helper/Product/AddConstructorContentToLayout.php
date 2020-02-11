<?php

namespace MageSuite\ContentConstructorAdmin\Plugin\Catalog\Helper\Product;

class AddConstructorContentToLayout
{
    /**
     * @var \MageSuite\ContentConstructorAdmin\Service\LayoutContentUpdateService
     */
    protected $layoutContentUpdateService;

    public function __construct(
        \MageSuite\ContentConstructorAdmin\Service\LayoutContentUpdateService $layoutContentUpdateService
    ) {
        $this->layoutContentUpdateService = $layoutContentUpdateService;
    }

    public function beforeInitProductLayout(
        \Magento\Catalog\Helper\Product\View $subject,
        \Magento\Framework\View\Result\Page $resultPage,
        $product,
        $params = null
    ) {
        $this->layoutContentUpdateService->addContentConstructorToUpdateLayout($resultPage, $product);
        return [$resultPage, $product, $params];
    }
}
