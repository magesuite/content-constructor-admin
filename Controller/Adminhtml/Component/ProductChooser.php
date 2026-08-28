<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Component;

class ProductChooser extends \Magento\Backend\App\Action implements
    \Magento\Framework\App\Action\HttpGetActionInterface,
    \Magento\Framework\App\Action\HttpPostActionInterface
{
    public const ADMIN_RESOURCE = 'Magento_Catalog::products';

    protected const DEFAULT_UNIQ_ID = 'ccProductChooser';

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        protected \Magento\Framework\Controller\Result\RawFactory $resultRawFactory,
        protected \Magento\Framework\View\Layout $layout,
        protected \Magento\Framework\Escaper $escaper
    ) {
        parent::__construct($context);
    }

    public function execute() // phpcs:ignore
    {
        $uniqId = $this->getRequest()->getParam('uniq_id') ?: self::DEFAULT_UNIQ_ID;

        $grid = $this->layout->createBlock(
            \MageSuite\ContentConstructorAdmin\Block\Adminhtml\Component\Product\Chooser::class,
            '',
            ['data' => ['id' => $this->escaper->escapeHtml($uniqId)]]
        );

        return $this->resultRawFactory->create()->setContents($grid->toHtml());
    }
}
