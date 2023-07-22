package brainary.tasking.services;

import java.util.Objects;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import brainary.tasking.entities.IssueTypeEntity;
import brainary.tasking.payloads.ChangelogPayload;
import brainary.tasking.repositories.IssueTypeRepository;
import brainary.tasking.schemas.IssueTypeSchema;

@Service
public class IssueTypeService {
    @Autowired
    private MessageSource messageSource;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private IssueTypeRepository issueTypeRepository;

    public IssueTypeSchema create(IssueTypeSchema issueTypeSchema) {
        if (issueTypeRepository.existsById(issueTypeSchema.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, messageSource.getMessage("issue-type.conflict", null, LocaleContextHolder.getLocale()));
        }
        if (Objects.isNull(issueTypeSchema.getActive())) {
            issueTypeSchema.setActive(true);
        }
        return modelMapper.map(issueTypeRepository.save(modelMapper.map(issueTypeSchema, IssueTypeEntity.class)), IssueTypeSchema.class);
    }

    public IssueTypeSchema deleteById(Integer issueTypeId) {
        IssueTypeSchema issueTypeSchema = findById(issueTypeId);
        issueTypeRepository.deleteById(issueTypeId);
        return issueTypeSchema;
    }

    public Page<IssueTypeSchema> findAll(Pageable pageable) {
        return issueTypeRepository.findAll(pageable).map(issueTypeEntity -> modelMapper.map(issueTypeEntity, IssueTypeSchema.class));
    }

    public IssueTypeSchema findById(Integer issueTypeId) {
        return modelMapper.map(issueTypeRepository.findById(issueTypeId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, messageSource.getMessage("issue-type.not-found", null, LocaleContextHolder.getLocale()))), IssueTypeSchema.class);
    }

    public ChangelogPayload<IssueTypeSchema> update(IssueTypeSchema issueTypeSchema) {
        return ChangelogPayload.<IssueTypeSchema>builder()
            .before(findById(issueTypeSchema.getId()))
            .after(modelMapper.map(issueTypeRepository.save(modelMapper.map(issueTypeSchema, IssueTypeEntity.class)), IssueTypeSchema.class))
            .build();
    }

}
