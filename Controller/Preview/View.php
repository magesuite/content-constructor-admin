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
    /**
     * @var \MageSuite\ContentConstructorAdmin\Service\PreviewSecretProvider
     */
    protected $previewSecretProvider;
    /**
     * @var \Magento\Framework\Controller\Result\ForwardFactory
     */
    protected $resultForwardFactory;


    public function __construct(
        Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper $componentConfigurationToXmlMapper,
        \Magento\Framework\App\Cache\TypeListInterface $cacheTypeList,
        \MageSuite\ContentConstructorAdmin\Service\PreviewSecretProvider $previewSecretProvider,
        \Magento\Framework\Controller\Result\ForwardFactory $resultForwardFactory
    )
    {
        parent::__construct($context);

        $this->context = $context;
        $this->resultPageFactory = $resultPageFactory;
        $this->componentConfigurationToXmlMapper = $componentConfigurationToXmlMapper;
        $this->cacheTypeList = $cacheTypeList;
        $this->previewSecretProvider = $previewSecretProvider;
        $this->resultForwardFactory = $resultForwardFactory;
    }

    /**
     * Dispatch request
     *
     * @return \Magento\Framework\Controller\ResultInterface|ResponseInterface
     * @throws \Magento\Framework\Exception\NotFoundException
     */
    public function execute()
    {
        $resultPage = $this->resultPageFactory->create();

        if (!$this->validatePreviewSecret()) {
            $resultForward = $this->resultForwardFactory->create([\Magento\Framework\Controller\ResultFactory::TYPE_FORWARD]);
            $resultForward->forward('noroute');
            return $resultForward;
        }

        $this->cacheTypeList->cleanType('layout');

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

    protected function validatePreviewSecret()
    {
        $requestSecret = $this->getRequest()->getParam('secret_preview_token');

        return $this->previewSecretProvider->execute($this->getRequest()->getParam('configuration')) === $requestSecret;
    }
}
