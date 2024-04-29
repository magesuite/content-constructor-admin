<?php
declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Controller\Preview;

class View extends \Magento\Framework\App\Action\Action implements \Magento\Framework\App\CsrfAwareActionInterface,
    \Magento\Framework\App\Action\HttpPostActionInterface
{
    protected \Magento\Framework\View\Result\PageFactory $resultPageFactory;
    protected \Magento\Framework\Controller\Result\ForwardFactory $resultForwardFactory;
    protected \Magento\Framework\View\Layout\LayoutCacheKeyInterface $layoutCacheKey;
    protected \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper $componentConfigurationToXmlMapper;
    protected \MageSuite\ContentConstructorAdmin\Service\PreviewSecretProvider $previewSecretProvider;

    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\View\Result\PageFactory $resultPageFactory,
        \Magento\Framework\Controller\Result\ForwardFactory $resultForwardFactory,
        \Magento\Framework\View\Layout\LayoutCacheKeyInterface $layoutCacheKey,
        \MageSuite\ContentConstructorAdmin\Repository\Xml\ComponentConfigurationToXmlMapper $componentConfigurationToXmlMapper,
        \MageSuite\ContentConstructorAdmin\Service\PreviewSecretProvider $previewSecretProvider
    ) {
        parent::__construct($context);
        $this->resultPageFactory = $resultPageFactory;
        $this->resultForwardFactory = $resultForwardFactory;
        $this->layoutCacheKey = $layoutCacheKey;
        $this->componentConfigurationToXmlMapper = $componentConfigurationToXmlMapper;
        $this->previewSecretProvider = $previewSecretProvider;
    }

    public function execute()
    {
        if (!$this->validatePreviewSecret()) {
            $resultForward = $this->resultForwardFactory->create([\Magento\Framework\Controller\ResultFactory::TYPE_FORWARD]);
            $resultForward->forward('noroute');
            return $resultForward;
        }

        $configuration = urldecode($this->getConfiguration());
        $this->layoutCacheKey->addCacheKeys(['cc_preview' => hash('sha256', $configuration)]);
        $configuration = json_decode($configuration, true);
        $layoutUpdate = $this->componentConfigurationToXmlMapper->map($configuration);

        $resultPage = $this->resultPageFactory->create();
        $resultPage->addHandle('cms_page_view');
        $resultPage->getConfig()->setPageLayout('1column');
        $resultPage->getLayout()->getUpdate()->addUpdate($layoutUpdate);

        return $resultPage;
    }

    public function createCsrfValidationException(\Magento\Framework\App\RequestInterface $request): ?\Magento\Framework\App\Request\InvalidRequestException
    {
        return null;
    }

    public function validateForCsrf(\Magento\Framework\App\RequestInterface $request): ?bool
    {
        return true;
    }

    protected function getConfiguration(): string
    {
        return (string)$this->getRequest()->getParam('configuration');
    }

    protected function validatePreviewSecret(): bool
    {
        $token = $this->getRequest()->getParam('secret_preview_token');

        return $this->previewSecretProvider->execute($this->getConfiguration()) === $token;
    }
}
