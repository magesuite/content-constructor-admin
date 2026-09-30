<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Model\Editor;

class ProductCollectionOptions
{
    public function __construct(
        protected \MageSuite\ContentConstructorFrontend\Model\Sort\Pool $sortersPool,
        protected \MageSuite\ContentConstructorFrontend\Model\Filter\Pool $filtersPool
    ) {
    }

    public function getSortersJson(): string
    {
        return $this->serializeOptions($this->sortersPool->getSorters());
    }

    public function getFiltersJson(): string
    {
        return $this->serializeOptions($this->filtersPool->getFilters());
    }

    protected function serializeOptions(?array $options): string
    {
        $serializedOptions = array_map(
            static fn (array $option): array => ['label' => $option['label'], 'value' => $option['value']],
            array_values($options ?? [])
        );

        return (string) json_encode($serializedOptions);
    }
}
