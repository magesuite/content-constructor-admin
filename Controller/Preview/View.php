<?php

namespace MageSuite\ContentConstructorAdmin\Controller\Preview;

use Magento\Backend\App\Action\Context;
use Magento\Framework\App\ResponseInterface;

class View extends \Magento\Framework\App\Action\Action implements \Magento\Framework\App\CsrfAwareActionInterface
{
    /**
     * @var Context
     */
    private $context;

    /**
     * @var \Magento\Framework\View\Result\PageFactory
     */
    private $resultPageFactory;
    /**
     * @var \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper
     */
    private $componentConfigurationToXmlMapper;
    /**
     * @var \Magento\Framework\App\Cache\TypeListInterface
     */
    private $cacheTypeList;

    public function __construct(
        Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper $componentConfigurationToXmlMapper,
        \Magento\Framework\App\Cache\TypeListInterface $cacheTypeList
    )
    {
        parent::__construct($context);

        $this->context = $context;
        $this->resultPageFactory = $resultPageFactory;
        $this->componentConfigurationToXmlMapper = $componentConfigurationToXmlMapper;
        $this->cacheTypeList = $cacheTypeList;
    }

    /**
     * Dispatch request
     *
     * @return \Magento\Framework\Controller\ResultInterface|ResponseInterface
     * @throws \Magento\Framework\Exception\NotFoundException
     */
    public function execute()
    {
        $this->cacheTypeList->cleanType('layout');

        $resultPage = $this->resultPageFactory->create();

        $configuration = urldecode($this->getRequest()->getParam('configuration'));

        $configuration = json_decode($configuration, true);

        $layoutUpdate = $this->componentConfigurationToXmlMapper->map($configuration);

        $resultPage->addHandle('cms_page_view');

        $resultPage->getConfig()->setPageLayout('1column');
        $resultPage->getLayout()->getUpdate()->addUpdate($layoutUpdate);

        return $resultPage;
    }

    /**
     * Create exception in case CSRF validation failed.
     * Return null if default exception will suffice.
     *
     * @param \Magento\Framework\App\RequestInterface $request
     *
     * @return \Magento\Framework\App\Request\InvalidRequestException|null
     */
    public function createCsrfValidationException(\Magento\Framework\App\RequestInterface $request): ?\Magento\Framework\App\Request\InvalidRequestException
    {
        return null;
    }

    /**
     * Perform custom request validation.
     * Return null if default validation is needed.
     *
     * @param \Magento\Framework\App\RequestInterface $request
     *
     * @return bool|null
     */
    public function validateForCsrf(\Magento\Framework\App\RequestInterface $request): ?bool
    {
        return true;
    }
}
