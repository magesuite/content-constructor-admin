<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Test\Integration\Controller\Adminhtml\ContentConstructor\UseDefault;

abstract class AbstractUseDefault extends \PHPUnit\Framework\TestCase
{
    protected ?\Magento\Framework\App\ObjectManager $objectManager;
    protected ?\Magento\Framework\App\RequestInterface $request;

    public function setUp(): void
    {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();
        $this->request = $this->objectManager->get(\Magento\Framework\App\RequestInterface::class);
    }
}
