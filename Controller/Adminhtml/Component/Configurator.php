<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Component;

class Configurator extends \Magento\Backend\App\Action
{
    public function __construct(
        protected \Magento\Backend\App\Action\Context $context,
        protected \Magento\Framework\Controller\Result\RawFactory $resultRawFactory,
        protected \Magento\Framework\View\Result\PageFactory $pageFactory,
        protected \Magento\Framework\View\Layout $layout,
        protected \MageSuite\ContentConstructorAdmin\Model\ComponentsPool $componentsPool
    ) {
        parent::__construct($context);
    }

    /**
     * Dispatch request
     *
     * @return \Magento\Framework\Controller\ResultInterface|ResponseInterface
     * @throws \Magento\Framework\Exception\NotFoundException
     */
    public function execute() // phpcs:ignore
    {
        $resultRaw = $this->resultRawFactory->create();

        $type = $this->getRequest()->getParam('type');

        $componentClassName = $this->componentsPool->getComponentClass($type);

        $contents = '';

        if($componentClassName) {
            $contents = $this->layout
                ->createBlock($componentClassName)
                ->toHtml();
        }

        return $resultRaw->setContents($contents);
    }
}
