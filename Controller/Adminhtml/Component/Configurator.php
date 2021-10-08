<?php

namespace MageSuite\ContentConstructorAdmin\Controller\Adminhtml\Component;

class Configurator extends \Magento\Framework\App\Action\Action
{
    /**
     * @var \Magento\Framework\View\Layout
     */
    protected $layout;

    /**
     * @var \Magento\Backend\App\Action\Context
     */
    protected $context;

    /**
     * @var \Magento\Framework\Controller\Result\RawFactory
     */
    protected $resultRawFactory;

    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    protected $pageFactory;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Model\ComponentsPool
     */
    protected $componentsPool;

    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Controller\Result\RawFactory $resultRawFactory,
        \Magento\Framework\View\Result\PageFactory $pageFactory,
        \Magento\Framework\View\Layout $layout,
        \MageSuite\ContentConstructorAdmin\Model\ComponentsPool $componentsPool
    )
    {
        parent::__construct($context);

        $this->context = $context;
        $this->resultRawFactory = $resultRawFactory;
        $this->pageFactory = $pageFactory;
        $this->layout = $layout;
        $this->componentsPool = $componentsPool;
    }

    /**
     * Dispatch request
     *
     * @return \Magento\Framework\Controller\ResultInterface|ResponseInterface
     * @throws \Magento\Framework\Exception\NotFoundException
     */
    public function execute()
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
